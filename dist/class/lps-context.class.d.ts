import { ILpsSoapHeader, LPS } from './lps.class';
export interface ILpsContextData {
    emitter: string;
    lps: LPS;
}
export interface ILpsContextOptions {
    id?: string;
    dateTime?: string;
}
export interface ILpsContextSoapHeader {
    soapHeader: {
        ContexteLPS: {
            attributes: {
                Nature: string;
                Version: string;
            };
            Id: string;
            Temps: string;
            Emetteur: string;
            LPS: ILpsSoapHeader;
        };
    };
    name: string;
    namespace: string;
}
export declare class LpsContext {
    id: string;
    dateTime: string;
    emitter: string;
    lps: LPS;
    constructor({ emitter, lps }: ILpsContextData, { id, dateTime }?: ILpsContextOptions);
    getSoapHeaderAsJson(): ILpsContextSoapHeader;
}
