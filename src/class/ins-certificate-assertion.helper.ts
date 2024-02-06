import {InsCertificateValidity } from '../models/ins-certificate-validator/ins-certificate-validator.models';
import {
  AssertionStatus,
  InsAssertionResult,
  InsAssertionType,
  InsCertificateIssuerCn,
  InsCertificateSubjectCn,
} from '../models/ins-certificate-validator/ins-assertion.models';
import { PKCS12Certificate } from '../models/ins-certificate-validator/pkcs12-certificate.models';

export class InsCertificateAssertionHelper {
  public static insCertificateValidIssuerCn = [InsCertificateIssuerCn.AC_IGC_SANTE, InsCertificateIssuerCn.TEST_AC_IGC_SANTE];
  public static insCertificateValidType = [InsCertificateSubjectCn.INSI_AUTO, InsCertificateSubjectCn.INSI_MANU];

  public static testCertificateForIns(certificate: PKCS12Certificate): { insCertificateValidity: InsCertificateValidity, insAssertions: Record<InsAssertionType, InsAssertionResult> } {
    const insAssertions = Object.values(InsAssertionType).reduce(
      (insAssertions, type) => ({ ...insAssertions, [type]: this._validateAssertion(type, certificate) }),
      {} as Record<InsAssertionType, InsAssertionResult>,
    );
    return {
      insCertificateValidity: Object.values(insAssertions).every(({ status }) => status === AssertionStatus.SUCCESS) ? InsCertificateValidity.VALID : InsCertificateValidity.INVALID,
      insAssertions,
    };
  }

  private static _validateAssertion(type: InsAssertionType, certificate: PKCS12Certificate): InsAssertionResult {
    switch (type) {
      case InsAssertionType.SUBJECT_CN:
        return this._validateSubjectCn(certificate);
      case InsAssertionType.ISSUER_CN:
        return this._validateIssuerCn(certificate);
      case InsAssertionType.VALIDITY_DATES:
        return this._validateValidityDates(certificate);
      default:
        return {
          status: AssertionStatus.FAILURE,
          message: 'Invalid assertion type',
        };
    }
  }

  public static _validateSubjectCn(certificate: PKCS12Certificate): InsAssertionResult {
    const isSubjectCnValid = this.insCertificateValidType.includes(certificate.subjectCN as InsCertificateSubjectCn);
    return {
      status: isSubjectCnValid ? AssertionStatus.SUCCESS : AssertionStatus.FAILURE,
      message: `Subject's common name: ${certificate.subjectCN}` + (isSubjectCnValid ? '' : `, it should be ${InsCertificateSubjectCn.INSI_AUTO} or ${InsCertificateSubjectCn.INSI_MANU}`),
    };
  }

  public static _validateIssuerCn(certificate: PKCS12Certificate): InsAssertionResult {
    const isIssuerCnValid = this.insCertificateValidIssuerCn.includes(certificate.issuerCN as InsCertificateIssuerCn);
    return {
      status: isIssuerCnValid ? AssertionStatus.SUCCESS : AssertionStatus.FAILURE,
      message: `Issuer's common name: ${certificate.issuerCN}` + (isIssuerCnValid ? '' : `, it should be ${InsCertificateIssuerCn.AC_IGC_SANTE} or ${InsCertificateIssuerCn.TEST_AC_IGC_SANTE}`),
    };
  }

  public static _validateValidityDates(certificate: PKCS12Certificate): InsAssertionResult {
    const now = new Date();
    const isDateValid = certificate.validity.notBefore < now && certificate.validity.notAfter > now;
    return {
      status: isDateValid ? AssertionStatus.SUCCESS : AssertionStatus.FAILURE,
      message: `Certificate validity dates: ${this._getValidityDatesMessage(certificate.validity)}` + (isDateValid ? '' : `, the certificate expired or is for later use`),
    }
  }

  public static _getValidityDatesMessage(validity: { notBefore: Date; notAfter: Date }): string {
    return `\n\tnotBefore: ${validity.notBefore.toISOString()}\n\tnotAfter: ${validity.notAfter.toISOString()}`;
  }
}
