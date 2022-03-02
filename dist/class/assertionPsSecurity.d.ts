import { ISecurity } from 'soap';
export interface AssertionPsInfos {
    issuer: string;
    nameQualifier: string;
    nameId: string;
    identifiantFacturation: string;
    codeSpecialiteAMO: string;
    secteurActivite: string;
}
export interface AssertionPsOptions {
    id?: string;
    dateTime?: string;
}
export declare class AssertionPsSecurity implements ISecurity {
    private assertionPsInfos;
    private publicP12PEM;
    private signer;
    constructor(privatePEM: any, publicP12PEM: any, password: any, assertionPsInfos: AssertionPsInfos);
    postProcess(xml: any, envelopeKey?: any, options?: AssertionPsOptions): string;
}
