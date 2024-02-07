/// <reference types="node" />
import { CheckInsCertificateResult } from '../models/ins-certificate-validator/ins-certificate-validator.models';
export declare class InsCertificateValidator {
    /**
     * Open the certificate with passphrase
     * @param  {Buffer} pfx certificate in p12/pfx format
     * @param  {string} passphrase the passphrase used to decipher the certificate
     * @returns {PKCS12Certificate | null} the certificate information or null if the passphrase is invalid
     */
    private static _openPKCS12Certificate;
    /**
     * Validate the PKCS12 Certificate for INS use
     * @param  {Buffer} pfx contains the Ins Certificate in p12/pfx format
     * @param  {string} passphrase the passphrase used to decipher the certificate
     * @returns {InsCertificateValidationResponse} the ins validation response
     * */
    static validatePKCS12(pfx: Buffer, passphrase: string): CheckInsCertificateResult;
}
