/// <reference types="node" />
import { LpsContext } from './class/lps-context.class';
import { BamContext } from './class/bam-context.class';
import { INSiPerson } from './class/insi-person.class';
import { INSiFetchInsResponse } from './models/insi-fetch-ins.models';
interface IINSiClientArgs {
    lpsContext: LpsContext;
    bamContext: BamContext;
}
/**
 * @constructor
 * @param  {IINSiClientArgs} InsClientArguments contains the lpsContext and the bamContext
 */
export declare class INSiClient {
    private readonly _wsdlUrl;
    private readonly _lpsContext;
    private readonly _bamContext;
    private _soapClient;
    constructor({ lpsContext, bamContext }: IINSiClientArgs);
    /**
     * Initializes a soap client and sets it's SSLSecurityPFX
     * @param  {Buffer} pfx contains the SSL certificate (public keys) and the corresponding private keys
     * @param  {string=''} passphrase needed for the pfx
     * @returns Promise
     */
    initClient(pfx: Buffer, passphrase?: string): Promise<void>;
    /**
     * Fetches INS information of a person
     * @param  {INSiPerson} person the person who's information are about to be fetched
     * @param  {string} requestId of the current request to Ins
     * @returns Promise<INSiFetchInsResponse>
     */
    fetchIns(person: INSiPerson, { requestId }?: {
        requestId?: string | undefined;
    }): Promise<INSiFetchInsResponse>;
    private _setClientSSLSecurityPFX;
    private _setDefaultHeaders;
    private _specificErrorManagement;
}
export {};
