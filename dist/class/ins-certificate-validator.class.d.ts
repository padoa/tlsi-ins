/// <reference types="node" />
import { IINSValidationResponse } from '../models/ins-certificate-validator.models';
export declare class InsCertificateValidator {
    private static _decryptCertificate;
    static validatePKCS12(pfx: Buffer, passPhrase: string): IINSValidationResponse;
}
