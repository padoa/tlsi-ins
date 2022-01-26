export interface IBamContextData {
    emitter: string;
}
export interface IBamContextOptions {
    id?: string;
    dateTime?: string;
}
export interface IBamContextSoapHeader {
    soapHeader: {
        ContexteBAM: {
            attributes: {
                Version: string;
            };
            Id: string;
            Temps: string;
            Emetteur: string;
            COUVERTURE: {};
        };
    };
    name: string;
    namespace: string;
}
export declare class BamContext {
    id: string;
    dateTime: string;
    emitter: string;
    constructor({ emitter }: IBamContextData, { id, dateTime }?: IBamContextOptions);
    getSoapHeaderAsJson(): IBamContextSoapHeader;
}
