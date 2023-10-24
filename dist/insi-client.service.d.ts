/// <reference types="node" />
import { LpsContext } from './class/lps-context.class';
import { BamContext } from './class/bam-context.class';
import { INSiPerson } from './class/insi-person.class';
import { INSiServiceFetchInsResult } from './models/insi-fetch-ins.models';
interface INSiClientArgs {
    lpsContext: LpsContext;
    bamContext: BamContext;
    overrideSpecialCases?: boolean;
}
export declare const INSi_CPX_TEST_URL = "https://qualiflps.services-ps.ameli.fr:443/lps";
export declare const INSi_mTLS_TEST_URL = "https://qualiflps-services-ps-tlsm.ameli.fr:443/lps";
/**
 * @constructor
 * @param  {INSiClientArgs} InsClientArguments contains the lpsContext and the bamContext
 */
export declare class INSiClient {
    private readonly _wsdlUrl;
    private readonly _lpsContext;
    private readonly _bamContext;
    private _soapClient;
    private _overrideSpecialCases;
    private _httpClient;
    constructor({ lpsContext, bamContext, overrideSpecialCases }: INSiClientArgs);
    /**
     * Initializes a soap client and sets it's SSLSecurityPFX TLS authentication
     * @param  {Buffer} pfx contains the SSL certificate (public keys) and the corresponding private keys
     * @param  {string=''} passphrase needed for the pfx
     * @param  {string} endpoint service url, test by default
     * @returns Promise
     */
    initClientPfx(pfx: Buffer, passphrase?: string, endpoint?: string): Promise<void>;
    /**
     * Initializes a soap client and sets it's AssertionPsSecurity
     * @param  {string} assertionPs the assertion Ps to use for the call
     * @param  {string} endpoint service url, test by default
     * @returns Promise
     */
    initClientCpx(assertionPs: string, endpoint?: string): Promise<void>;
    /**
     * Fetches INS information of a person
     * @param  {INSiPerson} person the person who's information are about to be fetched
     * @param  {string} requestId of the current request to Ins
     * @param  {boolean} virtualModeEnabled a boolean that enabled or not the virtual mode
     * @returns Promise<INSiServiceFetchInsResult>
     */
    fetchIns(person: INSiPerson, { requestId, virtualModeEnabled }?: {
        requestId?: string | undefined;
        virtualModeEnabled?: boolean | undefined;
    }): Promise<INSiServiceFetchInsResult>;
    private _launchSoapRequestForPerson;
    /**
     * This method is public as it needs to be mocked
     * @returns The emitter of the request
     */
    getLpsContextEmitter(): string;
    /**
     * Fetches INS information of a person
     * @param  {INSiPerson} person the person who's information are about to be fetched
     * @param  {string} requestId of the current request to Ins
     * @returns Promise<INSiServiceFetchInsResult>
     */
    private _getMockedPersonRequest;
    private _callFetchFromIdentityTraits;
    private _setSoapHeaders;
    private _setClientSSLSecurityPFX;
    private _setAssertionPsSecurity;
    private _setDefaultHeaders;
    private _specificErrorManagement;
    private _overrideHttpClientResponse;
    private _manageCndaValidationSpecialCases;
}
export {};
