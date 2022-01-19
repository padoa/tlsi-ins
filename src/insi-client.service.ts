import { Client, ClientSSLSecurityPFX, createClientAsync } from 'soap';
import { v4 as uuidv4 } from 'uuid';
import { LpsContext } from './class/lps-context.class';
import { BamContext } from './class/bam-context.class';
import { INSiPerson } from './class/insi-person.class';
import { combineCACertAsPem } from './utils/certificates';
import { INSiSoapActions } from './models/insi-soap-action.models';
import { INSiSearchFromIdentityTraits } from './models/insi-format.models';
import { InsiError } from './utils/insi-error';

interface IINSiClientData {
  lpsContext: LpsContext,
  bamContext: BamContext,
}

export class INSiClient {
  private readonly _wsdlUrl: string = 'src/fixtures/WSDL/DESIR_ICIR_EXP_1.5.0.wsdl';
  private readonly _lpsContext: LpsContext;
  private readonly _bamContext: BamContext;

  private _soapClient: Client;

  constructor({ lpsContext, bamContext }: IINSiClientData) {
    this._lpsContext = lpsContext;
    this._bamContext = bamContext;
  }

  public async initClient(pfx: Buffer, passphrase: string = ''): Promise<void> {
    this._soapClient = await createClientAsync(this._wsdlUrl, {
      forceSoap12Headers: true, // use soap v1.2
    });
    this._setClientSSLSecurityPFX(pfx, passphrase);
  }

  public async fetchIdentity(person: INSiPerson, { requestId = uuidv4() } = {}): Promise<INSiSearchFromIdentityTraits> {
    if (!this._soapClient) {
      throw new Error('fetchIdentity ERROR: you must init client first');
    }
    const { header, method } = INSiSoapActions.searchFromIdentityTraits;

    this._setDefaultHeaders();
    this._soapClient.addSoapHeader(header, 'Action', 'wsa', 'http://www.w3.org/2005/08/addressing');
    this._soapClient.addSoapHeader({ MessageID: requestId, }, 'MessageID', 'wsa', 'http://www.w3.org/2005/08/addressing');

    let rawSoapResponse;
    try {
      rawSoapResponse = await this._soapClient[`${method}Async`](person.getSoapDataAsJson());
    }
    catch (e: any) {
      // TODO: Better error management
      throw new InsiError({ requestId: requestId, originalError: e });
    }
    finally {
      this._soapClient.clearSoapHeaders();
    }
    const [responseAsJson, responseAsXMl, , requestAsXML] = rawSoapResponse;
    return { requestId, responseAsJson, responseAsXMl, requestAsXML };
  }

  private _setClientSSLSecurityPFX(pfx: Buffer, passphrase?: string): void {
    this._soapClient.setSecurity(new ClientSSLSecurityPFX(pfx, {
      passphrase,
      ca: combineCACertAsPem([
        'certificates/ca/ACR-EL.cer',
        'certificates/ca/ACI-EL-ORG.cer',
      ]),
    }))
  }

  private _setDefaultHeaders(): void {
    const { soapHeader: bamSoapHeader, name: bamName, namespace: bamNamespace } = this._bamContext.getSoapHeaderAsJson();
    this._soapClient.addSoapHeader(bamSoapHeader, bamName, bamNamespace);
    const { soapHeader: lpsSoapHeader, name: lpsName, namespace: lpsNamespace } = this._lpsContext.getSoapHeaderAsJson()
    this._soapClient.addSoapHeader(lpsSoapHeader, lpsName, lpsNamespace);
  }
}
