import {
  Client,
  ClientSSLSecurityPFX,
  createClientAsync
} from 'soap';
import fs from 'fs';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { AxiosResponse } from 'axios';
import { combineCACertAsPem, PASSPHRASE } from './certificates';
import { SoapClientHelper } from './soap-client.helper';

export interface SOAPINSConfig {
  softwareName: string;
  softwareVersion: string;
  emitter: string;
  IDAMAutorisationNumber: string;
}

export interface INSIdentityTraits {
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  birthdate: Date,
}

export interface INSSearchFromIdentityTraits {
  messageUuid: string;
  result: AxiosResponse;
}

const SoapActions = {
  ['searchFromIdentityTraits']: {
    header: { Action: 'urn:ServiceIdentiteCertifiee:1.0.0:rechercherInsAvecTraitsIdentite' },
    method: 'rechercherInsAvecTraitsIdentite',
  },
}

export class SoapINSClient {
  private readonly _wsdlUrl: string = 'src/fixtures/WSDL/DESIR_ICIR_EXP_1.5.0.wsdl';

  private readonly _config: SOAPINSConfig;

  private readonly _bamCtxId: string;
  private readonly _lpsCtxId: string;
  private readonly _lpsCtxInstance: string;

  private _soapClient: Client;

  constructor(config: SOAPINSConfig) {
    this._config = config;
    this._bamCtxId = uuidv4();
    this._lpsCtxId = uuidv4();
    this._lpsCtxInstance = uuidv4();
  }

  public async initialize(): Promise<void> {
    this._soapClient = await createClientAsync(this._wsdlUrl, {
      forceSoap12Headers: true, // use soap v1.2
    });

    this._setClientSSLSecurityPFX();
  }

  public async INSSearchFromIdentityTraits(payload: INSIdentityTraits): Promise<INSSearchFromIdentityTraits> {
    const { header, method } = SoapActions.searchFromIdentityTraits;
    const messageUuid = uuidv4();

    this._setDefaultHeaders();
    this._soapClient.addSoapHeader(header, 'Action', 'wsa', 'http://www.w3.org/2005/08/addressing');
    this._soapClient.addSoapHeader({ MessageID: messageUuid, }, 'MessageID', 'wsa', 'http://www.w3.org/2005/08/addressing');

    let result;
    try {
      result = await this._soapClient[`${method}Async`]({
        NomNaissance: payload.lastName,
        Prenom: payload.firstName,
        Sexe: payload.gender,
        DateNaissance: moment(payload.birthdate).format('YYYY - MM - DD'),
      });
    } catch (e: any) {
      result = e.response;
    }
    this._soapClient.clearSoapHeaders();
    return { messageUuid, result };
  }

  private _setClientSSLSecurityPFX(): void {
    const pfx = fs.readFileSync('certificates/INSI-AUTO/AUTO-certificate.p12');

    this._soapClient.setSecurity(new ClientSSLSecurityPFX(pfx, {
      passphrase: PASSPHRASE,
      ca: combineCACertAsPem([
        'certificates/ca/ACR-EL.cer',
        'certificates/ca/ACI-EL-ORG.cer',
      ])
    }))
  }

  private _setDefaultHeaders(): void {
    this._soapClient.addSoapHeader(
      SoapClientHelper.getBAMContext(this._bamCtxId, this._config),
      'ContexteBAM',
      'ctxbam'
    );
    this._soapClient.addSoapHeader(
      SoapClientHelper.getLPSContext(this._lpsCtxId, this._lpsCtxInstance, this._config),
      'ContexteLPS',
      'ctxlps'
    );
  }
}
