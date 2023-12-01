/// <reference types="node" />
import { IINSValidationResponse } from './InsCertificateValidator.model';
export declare class InsCertificateValidator {
    private static _decryptCertificate;
    static validateINSCertificate(pfx: Buffer, passPhrase: string): IINSValidationResponse;
}
