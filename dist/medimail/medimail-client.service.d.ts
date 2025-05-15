/// <reference types="node" />
import { CheckboxReturn, CheckboxType, HelloResult, OpenResult, SendMessageOptions, SendResult } from './models/medimail.types';
export declare class MedimailClient {
    private readonly wsdlUrl;
    private soapClient;
    private httpClient;
    private wsdl;
    private acount;
    constructor();
    init(pfx: Buffer, passphrase?: string, acount?: string): Promise<void>;
    /**
     * Test the api with a simple hello, the specified name should be the email of the connected user
     *
     * @param name Name of the user to greet
     * @returns Promise<HelloResult>
     */
    hello(name: string): Promise<HelloResult>;
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
    send(options: SendMessageOptions): Promise<SendResult>;
    /**
     * Opens the Medimail mailbox of the user, and returns the list of messages sent, received or both.
     *
     * @param type The type of data to get (1 = all, 2 = only received, 3 = only sent)
     * @param begindate The date to start the search
     * @param enddate The date to end the search
     * @returns Promise<CheckboxReturn>
     */
    checkbox(type: CheckboxType, begindate: Date, enddate?: Date): Promise<CheckboxReturn>;
    /**
     * Open a message to the Medimail API.
     *
     * @param ref The reference (id) of the message to open
     * @returns Promise<OpenResult>
     */
    open(ref: string): Promise<OpenResult>;
    private call;
    private extractErrorIfPresent;
}
