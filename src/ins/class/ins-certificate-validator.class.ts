import { util, asn1, pkcs12, pki } from 'node-forge';
import _ from 'lodash';
import {
  CheckInsCertificateResult, InsCertificateType,
  InsCertificateValidity,
} from '../models/ins-certificate-validator/ins-certificate-validator.models';
import { OpenPKCS12Response, PKCS12Certificate } from '../models/ins-certificate-validator/pkcs12-certificate.models';
import { InsCertificateAssertionHelper } from './ins-certificate-assertion.helper';
import { AssertionStatus } from '../models/ins-certificate-validator/ins-assertion.models';

export class InsCertificateValidator {
  /**
   * Open the certificate with passphrase
   * @param  {Buffer} pfx certificate in p12/pfx format
   * @param  {string} passphrase the passphrase used to decipher the certificate
   * @returns {PKCS12Certificate | null} the certificate information or null if the passphrase is invalid
   */
  private static _openPKCS12Certificate(pfx: Buffer, passphrase: string): OpenPKCS12Response {
    const pfxB64 = pfx.toString('base64');
    const p12Der = util.decode64(pfxB64);
    const p12Asn1 = asn1.fromDer(p12Der);
    let p12;
    try {
      p12 = pkcs12.pkcs12FromAsn1(p12Asn1, passphrase); // raise an error if certif/passphrase combination is invalid
    } catch (error) {
      if (error instanceof Error) {
        return { certificate: null, error: error.message };
      }
      else {
        return { certificate: null, error: 'Unknown error' };
      }
    }
    const bag = p12.getBags({
      bagType: pki.oids.certBag,
    })[pki.oids.certBag]?.[0]?.cert;

    if (!bag) {
      return { certificate: null, error: 'The certificate\'s bag is undefined !' };
    }

    const PKCS12Certificate: PKCS12Certificate = {
      base64: pfxB64,
      subjectCN: bag.subject.getField('CN').value,
      issuerCN: bag.issuer.getField('CN').value,
      validity: bag.validity,
    };

    return { certificate: PKCS12Certificate, error: null };
  }

  /**
   * Validate the PKCS12 Certificate for INS use
   * @param  {Buffer} pfx contains the Ins Certificate in p12/pfx format
   * @param  {string} passphrase the passphrase used to decipher the certificate
   * @returns {InsCertificateValidationResponse} the ins validation response
   * */
  public static validatePKCS12(pfx: Buffer, passphrase: string): CheckInsCertificateResult {
    const { certificate, error } = this._openPKCS12Certificate(pfx, passphrase);
    if (error !== null) {
      return {
        insCertificateValidity: InsCertificateValidity.INVALID,
        insCertificateType: null,
        certificate,
        error: { message: error },
      }
    }

    const assertionResult = InsCertificateAssertionHelper.checkInsAssertionForCertificate(certificate);
    const certificateHasPassedAssertion = _.every(assertionResult, ({ status }) => status === AssertionStatus.SUCCESS);
    if (!certificateHasPassedAssertion) {
      return {
        insCertificateValidity: InsCertificateValidity.INVALID,
        insCertificateType: null,
        insAssertions: assertionResult,
        certificate,
      };
    }

    return {
      insCertificateValidity: InsCertificateValidity.VALID,
      insCertificateType: certificate.subjectCN as InsCertificateType,
      insAssertions: assertionResult,
      certificate,
    };
  }
}
