export interface BamContextArgs {
    emitter: string;
}
export interface BamContextOptions {
    id?: string;
    dateTime?: string;
}
export interface BamContextSoapHeader {
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
    constructor({ emitter }: BamContextArgs, { id, dateTime }?: BamContextOptions);
    getSoapHeaderAsJson(): BamContextSoapHeader;
}
