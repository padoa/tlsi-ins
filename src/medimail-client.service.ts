import * as path from 'path';
import {
  Client,
  ClientSSLSecurityPFX,
  HttpClient,
  createClientAsync,
} from 'soap';
import { ISoapError } from 'soap/lib/client';

export enum MedimailActions {
  HELLO = 'hello',
}

export class MedimailClient {
  private readonly _wsdlUrl: string = path.resolve(
    __dirname,
    '../wsdl/medimail.wsdl'
  );

  private _soapClient: Client;
  private _httpClient: HttpClient;

  constructor() {}

  public async init(pfx: Buffer, passphrase: string = ''): Promise<void> {
    this._httpClient = new HttpClient();
    this._soapClient = await createClientAsync(this._wsdlUrl, {
      forceSoap12Headers: true,
      httpClient: this._httpClient,
    });
    this._soapClient.setSecurity(
      new ClientSSLSecurityPFX(pfx, {
        passphrase,
        // ca: combineCertAsPem([
        //   path.resolve(__dirname, '../certificates/ca/ACR-EL.cer'),
        //   path.resolve(__dirname, '../certificates/ca/ACI-EL-ORG.cer'),
        // ]),
      })
    );
  }

  public async hello(name: string): Promise<any> {
    // const payload = JSON.stringify({ name }); // SOAP-ENV:Client: Bad Request
    const payload = { name };
    return this._call(MedimailActions.HELLO, payload);
  }

  private async _call(action: MedimailActions, soapBody: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this._soapClient[action](
        soapBody,
        (
          err: ISoapError,
          result: any,
          rawResponse: string,
          soapHeader: any,
          rawRequest: string
        ) => {
          if (err) {
            reject(err);
          }
          const error = MedimailClient.extractErrorIfPresent(result);
          if (error) {
            reject(error);
          }

          resolve({
            status: 'SUCCESS',
            request: {
              id: 'requestId',
              xml: rawRequest,
            },
            response: {
              formatted: result,
              xml: rawResponse,
              error: null,
            },
          });
        }
      );
    });
  }

  public static extractErrorIfPresent(result: any): Error | null {
    /**
     * {
      attributes: { 'env:encodingStyle': 'http://www.w3.org/2003/05/soap-encoding' },
      result: 'return',
      return: {
        attributes: { 'xsi:type': 'xsd:string' },
        '$value': '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<hello>\n' +
          '  <status>error</status>\n' +
          '  <error id="0">Client SOAP certificat inconnu (CN=INSI-AUTO,OU=10B0152872,O=CENTRE DE SANTE RPPS15287,ST=Rhône (69),C=FR)</error>\n' +
          '</hello>'
      }
    }
     */
    if (result && result.return && result.return.$value) {
      const errorXml = result.return.$value;
      const errorMatch = errorXml.match(/<error id="\d+">(.+)<\/error>/);
      if (errorMatch) {
        return new Error(errorMatch[1]);
      }
    }
    return null;
  }
}
