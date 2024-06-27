import _ from 'lodash';
import {
  CheckInsCertificateResult, InsCertificateType,
  InsCertificateValidity,
} from '../models/ins-certificate-validator/ins-certificate-validator.models';
import { InsCertificateAssertionHelper } from './ins-certificate-assertion.helper';
import { AssertionStatus } from '../models/ins-certificate-validator/ins-assertion.models';
import {
  CertificateValidator
} from '../../globals/class/certificate-validator.class';

export class InsCertificateValidator {
  /**
   * Validate the PKCS12 Certificate for INS use
   * @param  {Buffer} pfx contains the Ins Certificate in p12/pfx format
   * @param  {string} passphrase the passphrase used to decipher the certificate
   * @returns {InsCertificateValidationResponse} the ins validation response
   * */
  public static validatePKCS12(pfx: Buffer, passphrase: string): CheckInsCertificateResult {
    const { certificate, error } = CertificateValidator.openPKCS12Certificate(pfx, passphrase);
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
