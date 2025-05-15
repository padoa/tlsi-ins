/// <reference types="node" />
import { ISecurity } from 'soap';
import https from 'https';
export declare class AssertionPsSecurityClass implements ISecurity {
    private assertionPs;
    private defaultOptions;
    constructor(assertionPs: string, defaultOptions?: https.AgentOptions);
    postProcess(xml: string, envelopeKey?: string): string;
    addOptions(options: any): void;
}
