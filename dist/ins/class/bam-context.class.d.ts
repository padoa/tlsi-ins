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
    emitter: string;
    constructor({ emitter }: BamContextArgs);
    getSoapHeaderAsJson(): BamContextSoapHeader;
}
