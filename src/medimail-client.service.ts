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
  SEND = 'send',
}

type Attachment = {
  name: string;
  content: string;
};
type MinimalMessage = {
  acount: string;
  signatories: string;
  recipients: string;
  title: string;
  message: string;
  attachments: [Attachment, Attachment, Attachment, Attachment, Attachment];
};

type IncompleteMessage = MinimalMessage & {
  loinc?: string | null;
  replyTo?: string | null;
  inReplyTo?: string | null;
  mailReferences?: string | null;
  accuseReception?: string | null;
  ins?: string | null;
  codecda?: string | null;
  nil?: string | null;
};

type MSSSoapResult = {
  return: {
    $value: string;
  };
};

type FormattedResponse = {
  status: 'SUCCESS' | 'ERROR';
  request: {
    id: string;
    xml: string;
  };
  response: {
    formatted: MSSSoapResult;
    xml: string;
    error: Error | null;
  };
};

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

  /**
   * Test the api with a simple hello.
   *
   * @param name Name of the person to greet
   * @returns complete once we get the first successful response
   */
  public async hello(name: string) {
    // const payload = JSON.stringify({ name }); // SOAP-ENV:Client: Bad Request
    const payload = { name };
    return this._call(MedimailActions.HELLO, payload);
  }

  /**
   * Send a message to the Medimail API.
   *
   * @param message The message to send
   * @returns complete once we get the first successful response
   */
  public async send(message: IncompleteMessage) {
    // const payload = JSON.stringify({ name }); // SOAP-ENV:Client: Bad Request
    const payload = {
      ...message,
    };
    return this._call(MedimailActions.SEND, payload);
  }

  private async _call<T>(
    action: MedimailActions,
    soapBody: T
  ): Promise<FormattedResponse> {
    return new Promise<FormattedResponse>((resolve, reject) => {
      this._soapClient[action](
        soapBody,
        (
          err: ISoapError,
          result: MSSSoapResult,
          rawResponse: string,
          // soapHeader: any,
          rawRequest: string
        ) => {
          if (err) {
            reject(err);
          }
          const errorString = MedimailClient.extractErrorIfPresent(result);
          if (errorString) {
            reject(new Error(errorString));
          }

          const formattedResponse: FormattedResponse = {
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
          };
          resolve(formattedResponse);
        }
      );
    });
  }

  public static extractErrorIfPresent(result: MSSSoapResult): string | null {
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
        return errorMatch[1];
      }
    }
    return null;
  }
}
