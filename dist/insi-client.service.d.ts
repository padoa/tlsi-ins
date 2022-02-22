/// <reference types="node" />
import { LpsContext } from './class/lps-context.class';
import { BamContext } from './class/bam-context.class';
import { INSiPerson } from './class/insi-person.class';
import { INSiFetchInsResponse } from './models/insi-fetch-ins.models';
import { AssertionPsInfos } from './class/assertionPsSecurity';
interface INSiClientArgs {
    lpsContext: LpsContext;
    bamContext: BamContext;
}
/**
 * @constructor
 * @param  {INSiClientArgs} InsClientArguments contains the lpsContext and the bamContext
 */
export declare class INSiClient {
    private readonly _wsdlUrl;
    private readonly _lpsContext;
    private readonly _bamContext;
    private _soapClient;
    constructor({ lpsContext, bamContext }: INSiClientArgs);
    /**
     * Initializes a soap client and sets it's SSLSecurityPFX TLS authentication
     * @param  {Buffer} pfx contains the SSL certificate (public keys) and the corresponding private keys
     * @param  {string=''} passphrase needed for the pfx
     * @returns Promise
     */
    initClientPfx(pfx: Buffer, passphrase?: string): Promise<void>;
    /**
     * Initializes a soap client and sets it's AssertionPsSecurity
     * @param  {string} privateKey the private key for certificate sign
     * @param  {string} publicKey the associated public key
     * @param  {string=''} password of the privateKey if needed
     * @param  {AssertionPsInfos} assertionPsInfos infos of the PS (Personel de Santé) that needed to build the assertion
     * @returns Promise
     */
    initClientCpx(privateKey: string, publicKey: string, password: string | undefined, assertionPsInfos: AssertionPsInfos): Promise<void>;
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
    private _setAssertionPsSecurity;
    private _setDefaultHeaders;
    private _specificErrorManagement;
}
export {};
