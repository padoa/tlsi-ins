import * as path from 'path';
import {
  Client,
  ClientSSLSecurityPFX,
  HttpClient,
  createClientAsync,
} from 'soap';
import { ISoapError } from 'soap/lib/client';
import { WSDL } from 'soap';

const formatDateToDatetime = (date: Date): string => date.toISOString().slice(0, 19);

export enum MedimailActions {
  HELLO = 'hello',
  SEND = 'send',
  OPEN = 'open',
  CHECKBOX = 'checkbox',
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
  checkboxReturn: {
    $value: string;
  };
};

type FormattedMSSResponse = {
  formatted: MSSSoapResult;
  xml: string;
  error: Error | null;
};

type SendMessageOptions = {
  title: string;
  message: string;
  signatories: string[];
  recipients?: string[];
  attachments?: SendAttachments;
};

type HelloResult = {
  hello: {
    status: string;
    hello: string;
  };
};

type SendResult = {
  webisend: {
    status: string,
    author: string,
    signatories: string,
    ignore: null,
    title: string,
    refs: {
      mss: string[] | string
    },
  }
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
  webiopen: {
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
}

type CheckboxMessage = {
  ref: string,
  author: Recipient,
  dtcreate: string,
  signatories: Signatory[],
  recipients: null,
  title: string,
}


type CheckboxReturn = {
  webicheckbox: {
    status: string,
    user: string,
    begindate: string,
    enddate: string,
    inputs: {
      kvp: CheckboxMessage[]
    },
    outputs: {
      kvp: CheckboxMessage[]
    },
  }
}

export enum CheckboxType {
  ALL_MESSAGES = 1,
  RECEIVED_MESSAGES = 2,
  SENT_MESSAGES = 3,
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
      })
    );
  }

  /**
   * Test the api with a simple hello.
   *
   * @param name Name of the person to greet
   * @returns complete once we get the first successful response
   */
  public async hello(name: string): Promise<HelloResult> {
    const payload = { name };
    const reply = await this._call(MedimailActions.HELLO, payload);
    return this._wsdl.xmlToObject(reply.formatted.return.$value);
  }

  /**
   * Send a message to the Medimail API.
   *
   * @param message The message to send
   * @returns complete once we get the first successful response
   */
  public async send(options: SendMessageOptions): Promise<SendResult> {
    const { title, message, signatories, recipients, attachments } = options;
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
    return this._wsdl.xmlToObject(reply.formatted.sendResult.$value);
  }

  /**
   * Checks received and sent email through the Medimail API.
   *
   * @param type The type of data to get (1 = all, 2 = only received, 3 = only sent)
   * @param begindate The date to start the search
   * @param enddate The date to end the search
   * @returns complete once we get the first successful response
   */
  public async checkbox(type: CheckboxType, begindate: Date, enddate: Date = new Date()): Promise<CheckboxReturn> {
    const payload = {
      acount: this._acount,
      type,
      begindate: formatDateToDatetime(begindate),
      ...(enddate ? { enddate: formatDateToDatetime(enddate) } : {}),
    };
    const reply = await this._call(MedimailActions.CHECKBOX, payload);
    return this._wsdl.xmlToObject(reply.formatted.checkboxReturn.$value);
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
    return this._wsdl.xmlToObject(reply.formatted.openReturn.$value)
  }

  private async _call<T>(
    action: MedimailActions,
    soapBody: T
  ): Promise<FormattedMSSResponse> {
    return new Promise<FormattedMSSResponse>((resolve, reject) => {
      this._soapClient[action](
        soapBody,
        (
          err: ISoapError,
          result: MSSSoapResult,
          rawResponse: string,
        ) => {
          if (err) {
            reject(err);
          }
          const errorString = MedimailClient.extractErrorIfPresent(result);
          if (errorString) {
            reject(new Error(errorString));
          }

          const formattedResponse: FormattedMSSResponse = {
            formatted: result,
            xml: rawResponse,
            error: null,
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
