import {
  CertificateValidator
} from '../../globals/class/certificate-validator.class';

export class MedimailCertificateValidator{
  /**
   * Validate the PKCS12 Certificate for INS use
   * @param  {Buffer} pfx contains the Ins Certificate in p12/pfx format
   * @param  {string} passphrase the passphrase used to decipher the certificate
   * @returns {} the validation response
   * */
  public static validatePKCS12(pfx: Buffer, passphrase: string): unknown {
    const {
      certificate,
      error
    } = CertificateValidator.openPKCS12Certificate(pfx, passphrase);
    if (error !== null) {
      return {
        valid: false,
        type: null,
        certificate,
        error: {message: error},
      }
    }

    const assertionResult = true/* TODO */
    if (!assertionResult) {
      return {
        valid: false,
        type: null,
        assertions: {subject: 'invalid', issuer: 'invalid'},
        certificate,
      };
    }

    return {
      valid: true,
      type: null,
      assertions: {subject: 'invalid', issuer: 'invalid'},
      certificate,
    };
  }
  }
