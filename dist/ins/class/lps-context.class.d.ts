import { LpsSoapHeader, LPS } from './lps.class';
export interface LpsContextArgs {
    emitter: string;
    lps: LPS;
}
export interface LpsContextOptions {
    id?: string;
    dateTime?: string;
}
export interface LpsContextSoapHeader {
    soapHeader: {
        ContexteLPS: {
            attributes: {
                Nature: string;
                Version: string;
            };
            Id: string;
            Temps: string;
            Emetteur: string;
            LPS: LpsSoapHeader;
        };
    };
    name: string;
    namespace: string;
}
export declare class LpsContext {
    emitter: string;
    lps: LPS;
    constructor({ emitter, lps }: LpsContextArgs);
    getSoapHeaderAsJson(): LpsContextSoapHeader;
}
