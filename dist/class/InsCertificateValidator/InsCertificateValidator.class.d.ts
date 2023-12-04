/// <reference types="node" />
import { IINSValidationResponse } from './InsCertificateValidator.model';
export declare class InsCertificateValidator {
    private static _decryptCertificate;
    static validatePKCS12(pfx: Buffer, passPhrase: string): IINSValidationResponse;
}
