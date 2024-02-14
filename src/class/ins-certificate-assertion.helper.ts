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

  public static checkInsAssertionForCertificate(certificate: PKCS12Certificate): Record<InsAssertionType, InsAssertionResult> {
    return  {
      [InsAssertionType.SUBJECT_CN]: this._validateSubjectCn(certificate),
      [InsAssertionType.ISSUER_CN]: this._validateIssuerCn(certificate),
      [InsAssertionType.VALIDITY_DATES]: this._validateValidityDates(certificate),
    }
  }

  private static _validateSubjectCn(certificate: PKCS12Certificate): InsAssertionResult {
    const subjectCnIsValid = this.insCertificateValidType.includes(certificate.subjectCN as InsCertificateSubjectCn);
    return {
      status: subjectCnIsValid ? AssertionStatus.SUCCESS : AssertionStatus.FAILURE,
      message: `Subject's common name: ${certificate.subjectCN}` + (subjectCnIsValid ? '' : `, it should be ${InsCertificateSubjectCn.INSI_AUTO} or ${InsCertificateSubjectCn.INSI_MANU}`),
    };
  }

  private static _validateIssuerCn(certificate: PKCS12Certificate): InsAssertionResult {
    const issuerCnIsValid = this.insCertificateValidIssuerCn.includes(certificate.issuerCN as InsCertificateIssuerCn);
    return {
      status: issuerCnIsValid ? AssertionStatus.SUCCESS : AssertionStatus.FAILURE,
      message: `Issuer's common name: ${certificate.issuerCN}` + (issuerCnIsValid ? '' : `, it should be ${InsCertificateIssuerCn.AC_IGC_SANTE} or ${InsCertificateIssuerCn.TEST_AC_IGC_SANTE}`),
    };
  }

  private static _validateValidityDates(certificate: PKCS12Certificate): InsAssertionResult {
    const now = new Date();
    const dateIsValid = certificate.validity.notBefore < now && certificate.validity.notAfter > now;
    return {
      status: dateIsValid ? AssertionStatus.SUCCESS : AssertionStatus.FAILURE,
      message: `Certificate validity dates: ${this._getValidityDatesMessage(certificate.validity)}` + (dateIsValid ? '' : `, the certificate expired or is for later use`),
    }
  }

  private static _getValidityDatesMessage(validity: { notBefore: Date; notAfter: Date }): string {
    return `\n\tnotBefore: ${validity.notBefore.toISOString()}\n\tnotAfter: ${validity.notAfter.toISOString()}`;
  }
}
