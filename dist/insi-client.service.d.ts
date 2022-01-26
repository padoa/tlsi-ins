/// <reference types="node" />
import { LpsContext } from './class/lps-context.class';
import { BamContext } from './class/bam-context.class';
import { INSiPerson } from './class/insi-person.class';
import { INSiFetchInsResponse } from './models/insi-fetch-ins.models';
interface IINSiClientData {
    lpsContext: LpsContext;
    bamContext: BamContext;
}
export declare class INSiClient {
    private readonly _wsdlUrl;
    private readonly _lpsContext;
    private readonly _bamContext;
    private _soapClient;
    constructor({ lpsContext, bamContext }: IINSiClientData);
    initClient(pfx: Buffer, passphrase?: string): Promise<void>;
    fetchIns(person: INSiPerson, { requestId }?: {
        requestId?: string | undefined;
    }): Promise<INSiFetchInsResponse>;
    private _setClientSSLSecurityPFX;
    private _setDefaultHeaders;
}
export {};
