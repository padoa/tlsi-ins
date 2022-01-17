import { Client, ClientSSLSecurityPFX, createClientAsync } from 'soap';
import { v4 as uuidv4 } from 'uuid';
import { LpsContext } from './class/lps-context.class';
import { BamContext } from './class/bam-context.class';
import { INSiPerson } from './class/insi-person.class';
import { combineCACertAsPem } from './utils/certificates';
import { INSiSoapActions } from './models/insi-soap-action.models';
import { INSiSearchFromIdentityTraits } from './models/insi-format.models';

interface IINSiClientData {
  lpsContext: LpsContext,
  bamContext: BamContext,
  passphrase: string;
  pfx: Buffer;
}

export class INSiClient {
  private readonly _wsdlUrl: string = 'src/fixtures/WSDL/DESIR_ICIR_EXP_1.5.0.wsdl';
  private readonly _passphrase: string;
  private readonly _pfx: Buffer;
  private readonly _lpsContext: LpsContext;
  private readonly _bamContext: BamContext;

  private _soapClient: Client;

  constructor({ lpsContext, bamContext, passphrase, pfx }: IINSiClientData) {
    this._lpsContext = lpsContext;
    this._bamContext = bamContext;
    this._passphrase = passphrase;
    this._pfx = pfx;
  }

  public async initialize(): Promise<void> {
    this._soapClient = await createClientAsync(this._wsdlUrl, {
      forceSoap12Headers: true, // use soap v1.2
    });
    this._setClientSSLSecurityPFX();
  }

  public async fetchIdentity(person: INSiPerson): Promise<INSiSearchFromIdentityTraits> {
    const { header, method } = INSiSoapActions.searchFromIdentityTraits;
    const requestId = uuidv4();

    this._setDefaultHeaders();
    this._soapClient.addSoapHeader(header, 'Action', 'wsa', 'http://www.w3.org/2005/08/addressing');
    this._soapClient.addSoapHeader({ MessageID: requestId, }, 'MessageID', 'wsa', 'http://www.w3.org/2005/08/addressing');

    let result;
    try {
      result = await this._soapClient[`${method}Async`](person.getSoapDataAsJson());
    } catch (e: any) {
      console.log('ERROR', e);
      result = e.response;
    }
    this._soapClient.clearSoapHeaders();
    return { requestId, result };
  }

  private _setClientSSLSecurityPFX(): void {
    this._soapClient.setSecurity(new ClientSSLSecurityPFX(this._pfx, {
      passphrase: this._passphrase,
      ca: combineCACertAsPem([
        'certificates/ca/ACR-EL.cer',
        'certificates/ca/ACI-EL-ORG.cer',
      ]),
    }))
  }

  private _setDefaultHeaders(): void {
    const bamSoapHeader = this._bamContext.getSoapHeaderAsJson();
    this._soapClient.addSoapHeader(bamSoapHeader, 'ContexteBAM', 'ctxbam');
    const lpsSoapHeader = this._lpsContext.getSoapHeaderAsJson()
    this._soapClient.addSoapHeader(lpsSoapHeader, 'ContexteLPS', 'ctxlps');
  }
}
