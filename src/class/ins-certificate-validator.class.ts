import { util, asn1, pkcs12, pki } from 'node-forge';
import {
  IPKCS12Certificate,
  IINSValidationResponse,
  INSCertificateValidity,
  INSValidityAssertion,
  AssertionType,
  AssertionStatus,
  ICertificateType,
  IINSValidationResponseMetadata
} from '../models/ins-certificate-validator.models';

export class InsCertificateValidator {
  private static _decryptCertificate(pfx: Buffer, passPhrase: string): {certificate: IPKCS12Certificate | null, error: string | null} {
    const pfxB64 = pfx.toString('base64');

    const p12Der = util.decode64(pfxB64);
    const p12Asn1 = asn1.fromDer(p12Der);
    let p12;
    try {
      p12 = pkcs12.pkcs12FromAsn1(p12Asn1, passPhrase); // raise an error if certif/passphrase combination is invalid
    } catch (error) {
      if (error instanceof Error) {
        return {certificate: null, error: error.message};
      }
      else {
        return {certificate: null, error: 'Unknown error'};
      }
    }
    const bag =  p12.getBags({
      bagType: pki.oids.certBag,
    })[pki.oids.certBag]?.[0]?.cert;

    if (!bag) {
      return {certificate: null, error: 'The certificate\'s bag is undefined !'};
    }

    const PKCS12Certificate: IPKCS12Certificate = {
      pfx: pfxB64,
      subjectCN: bag.subject.getField('CN').value,
      issuerCN: bag.issuer.getField('CN').value,
      validity: bag.validity,
    };

    return {certificate: PKCS12Certificate, error: null};
  }

  public static validatePKCS12(pfx: Buffer, passPhrase: string): IINSValidationResponse {
    const {certificate, error} = this._decryptCertificate(pfx, passPhrase);
    if (error!== null || certificate === null) {
      return {
        certificateValidity: INSCertificateValidity.INVALID,
        assertions: [],
        error: {message: error? error : 'The certificate is null without error message'},
        metadata: { endDate: new Date(0), certificateType: ICertificateType.OTHER,},
      }
    }
    const assertions: INSValidityAssertion[] = [];

    const isSubjectCnValid = certificate.subjectCN !== ICertificateType.INSI_AUTO && certificate.subjectCN !== ICertificateType.INSI_MANU; 
    const subjectCnMessage = isSubjectCnValid ? `Subject's common name = ${certificate.subjectCN}, it should be ${ICertificateType.INSI_AUTO} or ${ICertificateType.INSI_MANU}` : `Subject's common name = ${certificate.subjectCN}`;
    const isIssuerCnValid = certificate.issuerCN !== 'AC IGC-SANTE ELEMENTAIRE ORGANISATIONS' && certificate.issuerCN !=='TEST AC IGC-SANTE ELEMENTAIRE ORGANISATIONS';
    const issuerCnMessage = isIssuerCnValid ? `Issuer's common name = ${certificate.issuerCN}, it should be AC IGC-SANTE ELEMENTAIRE ORGANISATIONS or TEST AC IGC-SANTE ELEMENTAIRE ORGANISATIONS` :   `Issuer's common name = ${certificate.issuerCN}`
    const now = new Date();
    const isCertificateDateValid = certificate.validity.notBefore > now || certificate.validity.notAfter < now
    const certificateDateMessage = isCertificateDateValid ? `The certificate expired or is for later use.\ncertificate dates: ${JSON.stringify(certificate.validity)}` : `validity = ${JSON.stringify(certificate.validity)}` 
    const getAssertion = ((value: boolean) => value ? AssertionStatus.SUCCESS : AssertionStatus.FAIL);

    assertions.push({
      type: AssertionType.SUBJECT_CN,
      status: getAssertion(isSubjectCnValid),
      message: subjectCnMessage,
    });

    assertions.push({
      type: AssertionType.ISSUER_CN,
      status: getAssertion(isIssuerCnValid),
      message: issuerCnMessage,
    });

    assertions.push({
      type: AssertionType.VAILIDITY_DATES,
      status: getAssertion(isCertificateDateValid),
      message: certificateDateMessage 
    });

    const metadata: IINSValidationResponseMetadata = {
      endDate: certificate.validity.notAfter,
      certificateType: isSubjectCnValid ? certificate.issuerCN as ICertificateType : ICertificateType.OTHER,
    }

    const certificateValidity = assertions.some((assertion) => assertion.status === AssertionStatus.FAIL) ? INSCertificateValidity.VALID : INSCertificateValidity.INVALID;
    return {
      certificateValidity,
      assertions,
      metadata,
    };
  }
}
