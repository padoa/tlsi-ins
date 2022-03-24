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
export declare class AssertionPsSecurityClass implements ISecurity {
    private _assertionPsInfos;
    private _publicP12PEM;
    private _signer;
    constructor(privatePEM: any, publicP12PEM: any, password: any, assertionPsInfos: AssertionPsInfos);
    postProcess(xml: string, envelopeKey?: string, options?: AssertionPsOptions): string;
}
