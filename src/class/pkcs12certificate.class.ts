import { util, asn1, pkcs12, pki } from 'node-forge';

interface IValidity {
  notBefore: Date;
  notAfter: Date;
}

export interface IPKCS12Certificate {
  pfx: Buffer;
  subjectCN: string;
  issuerCN: string;
  validity: IValidity;
}

export class PKCS12Certificate {
  public static decryptCertificate(pfx: Buffer, passPhrase: string): IPKCS12Certificate {
    const certificate = pfx.toString('base64');

    const p12Der = util.decode64(certificate);
    const p12Asn1 = asn1.fromDer(p12Der);
    const p12 = pkcs12.pkcs12FromAsn1(p12Asn1, passPhrase); // raise an error if certif/passphrase combination is invalid
    const bag =  p12.getBags({
      bagType: pki.oids.certBag,
    })[pki.oids.certBag]?.[0]?.cert;

    if (!bag) {
      throw new Error('The certificate\'s bag is undefined !')
    }

    const PKCS12Certificate: IPKCS12Certificate = {
      pfx,
      subjectCN: bag.subject.getField('CN').value,
      issuerCN: bag.issuer.getField('CN').value,
      validity: bag.validity,
    };

    return PKCS12Certificate;
  }

  public static validateINSCertificate(certificate: IPKCS12Certificate ): void {
    if (certificate.subjectCN !== 'INSI-AUTO' && certificate.subjectCN !== 'INSI-MANU') {
      throw new Error('The common name of the subject is not valid for INS');
    }

    if (certificate.issuerCN !== 'AC IGC-SANTE ELEMENTAIRE ORGANISATIONS' && certificate.issuerCN !=='TEST AC IGC-SANTE ELEMENTAIRE ORGANISATIONS') {
      throw new Error('The common name of the issuer is not valid for INS');
    }
    const now = new Date();

    if (certificate.validity.notBefore > now || certificate.validity.notAfter < now) {
      throw new Error(`The certificate expired or is for later use.\ncertificate dates: ${certificate.validity.notBefore} - ${certificate.validity.notAfter}`);
    }
  }
}
