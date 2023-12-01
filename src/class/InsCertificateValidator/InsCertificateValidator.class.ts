import { util, asn1, pkcs12, pki } from 'node-forge';
import { IPKCS12Certificate, IINSValidationResponse, INSCertificateValidity, INSValidityAssertion, AssertionType, AssertionStatus } from './InsCertificateValidator.model';

export class InsCertificateValidator {
  private static _decryptCertificate(pfx: Buffer, passPhrase: string): IPKCS12Certificate {
    const pfxB64 = pfx.toString('base64');

    const p12Der = util.decode64(pfxB64);
    const p12Asn1 = asn1.fromDer(p12Der);
    const p12 = pkcs12.pkcs12FromAsn1(p12Asn1, passPhrase); // raise an error if certif/passphrase combination is invalid
    const bag =  p12.getBags({
      bagType: pki.oids.certBag,
    })[pki.oids.certBag]?.[0]?.cert;

    if (!bag) {
      throw new Error('The certificate\'s bag is undefined !')
    }

    const PKCS12Certificate: IPKCS12Certificate = {
      pfx: pfxB64,
      subjectCN: bag.subject.getField('CN').value,
      issuerCN: bag.issuer.getField('CN').value,
      validity: bag.validity,
    };

    return PKCS12Certificate;
  }

  public static validatePKCS12(pfx: Buffer, passPhrase: string): IINSValidationResponse {
    const certificate = this._decryptCertificate(pfx, passPhrase);
    let certificateValidity = INSCertificateValidity.VALID;
    const assertions: INSValidityAssertion[] = [];

    if (certificate.subjectCN !== 'INSI-AUTO' && certificate.subjectCN !== 'INSI-MANU') {
      assertions.push({
        type: AssertionType.SUBJECT_CN,
        status: AssertionStatus.FAIL,
        message: 'The common name of the subject is not valid for INS, it should be INSI-AUTO or INSI-MANU',
      });
      certificateValidity = INSCertificateValidity.INVALID;
    } else {
      assertions.push({
        type: AssertionType.SUBJECT_CN,
        status: AssertionStatus.SUCCESS,
        message: `Subjec's common name = ${certificate.subjectCN}`,
      });
    }

    if (certificate.issuerCN !== 'AC IGC-SANTE ELEMENTAIRE ORGANISATIONS' && certificate.issuerCN !=='TEST AC IGC-SANTE ELEMENTAIRE ORGANISATIONS') {
      assertions.push({
        type: AssertionType.ISSUER_CN,
        status: AssertionStatus.FAIL,
        message: 'The common name of the issuer is not valid for INS, it should be AC IGC-SANTE ELEMENTAIRE ORGANISATIONS or TEST AC IGC-SANTE ELEMENTAIRE ORGANISATIONS',
      });
      certificateValidity = INSCertificateValidity.INVALID;
    } else {
      assertions.push({
        type: AssertionType.ISSUER_CN,
        status: AssertionStatus.SUCCESS,
        message: `Issuer's common name = ${certificate.issuerCN}`,
      });
    }
    const now = new Date();

    if (certificate.validity.notBefore > now || certificate.validity.notAfter < now) {
      assertions.push({
        type: AssertionType.VAILIDITY_DATES,
        status: AssertionStatus.FAIL,
        message: `The certificate expired or is for later use.\ncertificate dates: ${certificate.validity.notBefore} - ${certificate.validity.notAfter}`,
      });
      certificateValidity = INSCertificateValidity.INVALID;
    } else {
      assertions.push({
        type: AssertionType.VAILIDITY_DATES,
        status: AssertionStatus.SUCCESS,
        message: `validity = ${JSON.stringify(certificate.validity)}`,
      });
    }

    return {
      certificateValidity,
      assertions,
    };
  }
}