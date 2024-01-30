import { util, asn1, pkcs12, pki } from 'node-forge';
import {
  IPKCS12Certificate,
  IINSValidationResponse,
  INSCertificateValidity,
  INSValidityAssertion,
  AssertionType,
  AssertionStatus,
  ICertificateType,
  IINSValidationResponseMetadata,
  InsIssuerCn
} from '../models/ins-certificate-validator.models';

export class InsCertificateValidator {
  private static _decryptCertificate(pfx: Buffer, passPhrase: string): { certificate: IPKCS12Certificate | null, error: string | null } {
    const pfxB64 = pfx.toString('base64');

    const p12Der = util.decode64(pfxB64);
    const p12Asn1 = asn1.fromDer(p12Der);
    let p12;
    try {
      p12 = pkcs12.pkcs12FromAsn1(p12Asn1, passPhrase); // raise an error if certif/passphrase combination is invalid
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

    const PKCS12Certificate: IPKCS12Certificate = {
      pfx: pfxB64,
      subjectCN: bag.subject.getField('CN').value,
      issuerCN: bag.issuer.getField('CN').value,
      validity: bag.validity,
    };

    return { certificate: PKCS12Certificate, error: null };
  }

  public static validatePKCS12(pfx: Buffer, passPhrase: string): IINSValidationResponse {
    const { certificate, error } = this._decryptCertificate(pfx, passPhrase);
    if (error !== null || certificate === null) {
      return {
        certificateValidity: INSCertificateValidity.INVALID,
        assertions: [],
        error: { message: error? error : 'The certificate is null without error message' },
        metadata: { endDate: new Date(0), certificateType: ICertificateType.OTHER },
      }
    }
    const assertions: INSValidityAssertion[] = [];

    const isSubjectCnValid = [ICertificateType.INSI_AUTO, ICertificateType.INSI_MANU].includes(certificate.subjectCN as ICertificateType);
    const subjectCnFailedMessage = isSubjectCnValid ? '' : `, it should be ${ICertificateType.INSI_AUTO} or ${ICertificateType.INSI_MANU}`;
    const subjectCnMessage = `Subject's common name = ${certificate.subjectCN}` + subjectCnFailedMessage;
    const isIssuerCnValid = [InsIssuerCn.AC_IGC_SANTE, InsIssuerCn.TEST_AC_IGC_SANTE].includes(certificate.issuerCN as InsIssuerCn);
    const issuerFailedMessage = isIssuerCnValid ? '' : `, it should be ${InsIssuerCn.AC_IGC_SANTE} or ${InsIssuerCn.TEST_AC_IGC_SANTE}`;
    const issuerCnMessage = `Issuer's common name = ${certificate.issuerCN}` + issuerFailedMessage;
    const now = new Date();
    const isCertificateDateValid = certificate.validity.notBefore < now && certificate.validity.notAfter > now;
    const certificateExpiredMessage = isCertificateDateValid ? '' : 'The certificate expired or is for later use\n';
    const certificateDateMessage = certificateExpiredMessage + `certificate dates: ${JSON.stringify(certificate.validity)}`;
    const getAssertionStatus = ((value: boolean) => value ? AssertionStatus.SUCCESS : AssertionStatus.FAIL);

    assertions.push({
      type: AssertionType.SUBJECT_CN,
      status: getAssertionStatus(isSubjectCnValid),
      message: subjectCnMessage,
    });

    assertions.push({
      type: AssertionType.ISSUER_CN,
      status: getAssertionStatus(isIssuerCnValid),
      message: issuerCnMessage,
    });

    assertions.push({
      type: AssertionType.VALIDITY_DATES,
      status: getAssertionStatus(isCertificateDateValid),
      message: certificateDateMessage,
    });

    const metadata: IINSValidationResponseMetadata = {
      endDate: certificate.validity.notAfter,
      certificateType: isSubjectCnValid ? certificate.issuerCN as ICertificateType : ICertificateType.OTHER,
    }

    const certificateValidity = assertions.every((assertion) => assertion.status === AssertionStatus.SUCCESS) ? INSCertificateValidity.VALID : INSCertificateValidity.INVALID;
    return {
      certificateValidity,
      assertions,
      metadata,
    };
  }
}
