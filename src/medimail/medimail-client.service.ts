import * as path from 'path';
import {
  Client,
  ClientSSLSecurityPFX,
  HttpClient,
  createClientAsync,
} from 'soap';
import { ISoapError } from 'soap/lib/client';
import { WSDL } from 'soap';
import { CheckboxReturn, CheckboxType, FormattedMSSResponse, HelloResult, MSSSoapResult, MedimailActions, OpenResult, SendMessageOptions, SendResult } from './models/medimail.types';

const formatDateToDatetime = (date: Date): string => date.toISOString().slice(0, 19);


export class MedimailClient {
  private readonly wsdlUrl: string = path.resolve(
    __dirname,
    '../wsdl/medimail.wsdl'
  );

  private soapClient: Client;
  private httpClient: HttpClient;
  private wsdl: WSDL;
  private acount: string;

  constructor() { }

  public async init(pfx: Buffer, passphrase: string = '', acount = ''): Promise<void> {
    this.httpClient = new HttpClient();
    this.acount = acount;
    this.wsdl = new WSDL(this.wsdlUrl, this.wsdlUrl, {});
    this.soapClient = await createClientAsync(this.wsdlUrl, {
      forceSoap12Headers: true,
      httpClient: this.httpClient,
    });
    this.soapClient.setSecurity(
      new ClientSSLSecurityPFX(pfx, {
        passphrase,
      })
    );
  }

  /**
   * Test the api with a simple hello, the specified name should be the email of the connected user
   *
   * @param name Name of the user to greet
   * @returns Promise<HelloResult>
   */
  public async hello(name: string): Promise<HelloResult> {
    const payload = { name };
    const reply = await this.call(MedimailActions.HELLO, payload);
    return this.wsdl.xmlToObject(reply.formatted.return.$value);
  }

  /**
   * Send a message through the Medimail API.
   *
   * @param options options of the message to send
   * @param options.title title of the message to send
   * @param options.message text body of the message to send
   * @param options.signatories main recipients of the message to send (what we would usually call 'recipient')
   * @param options.recipients recipients for information of the message to send
   * @param options.attachments files to attach to the message to send, max size 5 
   * @returns Promise<SendResult>
   */
  public async send(options: SendMessageOptions): Promise<SendResult> {
    const { title, message, signatories, recipients, attachments } = options;
    const joinedSignatories = signatories.join(';');
    const joinedRecipients = recipients?.join(';');
    const payload = {
      message,
      title,
      acount: this.acount,
      signatories: joinedSignatories,
      recipients: joinedRecipients,
      attachments,
    };
    const reply = await this.call(MedimailActions.SEND, payload);
    return this.wsdl.xmlToObject(reply.formatted.sendResult.$value);
  }

  /**
   * Opens the Medimail mailbox of the user, and returns the list of messages sent, received or both.
   *
   * @param type The type of data to get (1 = all, 2 = only received, 3 = only sent)
   * @param begindate The date to start the search
   * @param enddate The date to end the search
   * @returns Promise<CheckboxReturn>
   */
  public async checkbox(type: CheckboxType, begindate: Date, enddate: Date = new Date()): Promise<CheckboxReturn> {
    const payload = {
      acount: this.acount,
      type,
      begindate: formatDateToDatetime(begindate),
      ...(enddate ? { enddate: formatDateToDatetime(enddate) } : {}),
    };
    const reply = await this.call(MedimailActions.CHECKBOX, payload);
    return this.wsdl.xmlToObject(reply.formatted.checkboxReturn.$value);
  }

  /**
   * Open a message to the Medimail API.
   *
   * @param ref The reference (id) of the message to open
   * @returns Promise<OpenResult>
   */
  public async open(ref: string): Promise<OpenResult> {
    const payload = {
      ref,
      acount: this.acount,
    };
    const reply = await this.call(MedimailActions.OPEN, payload);
    return this.wsdl.xmlToObject(reply.formatted.openReturn.$value)
  }

  private async call<T>(
    action: MedimailActions,
    soapBody: T
  ): Promise<FormattedMSSResponse> {
    return new Promise<FormattedMSSResponse>((resolve, reject) => {
      this.soapClient[action](
        soapBody,
        (
          err: ISoapError,
          result: MSSSoapResult,
          rawResponse: string,
        ) => {
          if (err) {
            reject(err);
          }
          const errorString = this.extractErrorIfPresent(result);
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

  private extractErrorIfPresent(result: MSSSoapResult): string | null {
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
