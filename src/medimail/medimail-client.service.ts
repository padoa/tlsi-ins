import * as path from 'path';
import {
  Client,
  ClientSSLSecurityPFX,
  HttpClient,
  createClientAsync,
} from 'soap';
import { ISoapError } from 'soap/lib/client';
import { WSDL } from 'soap';

export enum MedimailActions {
  HELLO = 'hello',
  SEND = 'send',
  OPEN = 'open',
}

type Attachment = {
  name: string;
  content: string;
};

type SendAttachments = {
  attachment1?: Attachment;
  attachment2?: Attachment;
  attachment3?: Attachment;
  attachment4?: Attachment;
  attachment5?: Attachment;
};

type MSSSoapResult = {
  return: {
    $value: string;
  };
  sendResult: {
    $value: string;
  };
  openReturn: {
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

type SendMessageOptions = {
  title: string;
  message: string;
  signatories: string[];
  recipients?: string[];
  attachments?: SendAttachments;
};

type SendResult = {
  status: string,
  author: string,
  signatories: string,
  ignore: null,
  title: string,
  refs: {
    mss: string[] | string
  },
}

type Signatory = {
  firstname: string;
  lastname: string;
  email: string;
}

type Recipient = {
  firstname: string;
  lastname: string;
  email: string;
}

type OpenResult = {
  status: string,
  call: string,
  author: {
    firstname: string,
    lastname: string,
    email: string,
  },
  begindate: string,
  enddate: string | null,
  signatories: Signatory[],
  recipients: Recipient[],
  title: string,
  content: string,
  nbattachments: string,
  attachments: Attachment[],
  'message-id': string,
  inReplyTo: string | null,
  references: string | null,
  replyTo: string,
}

export class MedimailClient {
  private readonly _wsdlUrl: string = path.resolve(
    __dirname,
    '../wsdl/medimail.wsdl'
  );

  private _soapClient: Client;
  private _httpClient: HttpClient;
  private _wsdl: WSDL;
  private _acount: string;

  constructor() { }

  public async init(pfx: Buffer, passphrase: string = '', acount = ''): Promise<void> {
    this._httpClient = new HttpClient();
    this._acount = acount;
    this._wsdl = new WSDL(this._wsdlUrl, this._wsdlUrl, {});
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
    const payload = { name };
    return this._call(MedimailActions.HELLO, payload);
  }

  /**
   * Send a message to the Medimail API.
   *
   * @param message The message to send
   * @returns complete once we get the first successful response
   */
  public async send(options: SendMessageOptions): Promise<SendResult> {
    const { title, message, signatories, recipients,attachments } = options;
    const joinedSignatories = signatories.join(';');
    const joinedRecipients = recipients?.join(';');
    const payload = {
      message,
      title,
      acount: this._acount,
      signatories: joinedSignatories,
      recipients: joinedRecipients,
      attachments,
    };
    const reply = await this._call(MedimailActions.SEND, payload);
    return this._wsdl.xmlToObject(reply.response.formatted.sendResult.$value).webisend;
  }

  /**
   * Open a message to the Medimail API.
   *
   * @param ref The reference of the message to send
   * @returns complete once we get the first successful response
   */
  public async open(ref: string): Promise<OpenResult> {
    const payload = {
      ref,
      acount: this._acount,
    };
    const reply = await this._call(MedimailActions.OPEN, payload);
    return this._wsdl.xmlToObject(reply.response.formatted.openReturn.$value).webiopen
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
