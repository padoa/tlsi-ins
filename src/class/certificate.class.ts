import fs from 'fs';
import { util, asn1, pkcs12, pki } from 'node-forge';

interface IValidity {
  notBefore: Date;
  notAfter: Date;
}

interface ICertificate {
  pfx: Buffer;
  subjectCN: string;
  issuerCN: string;
  validity: IValidity;
}

export class Certificate {
  public static decryptCertificate(certificatePath: string, passPhrase: string): ICertificate {
    const pfx = fs.readFileSync(certificatePath)
    const certificate = fs.readFileSync(certificatePath, {encoding: 'base64'});

    const p12Der = util.decode64(certificate);
    const p12Asn1 = asn1.fromDer(p12Der);
    const p12 = pkcs12.pkcs12FromAsn1(p12Asn1, passPhrase); // raise an error if certif/passphrase combination is invalid
    const bag =  p12.getBags({
      bagType: pki.oids.certBag,
    })[pki.oids.certBag]?.[0]?.cert;

    if (!bag) {
      throw new Error('The certificate\'s bag is undefined !')
    }
    
    if (bag.subject.getField('CN').value !== 'INSI-AUTO' && bag.subject.getField('CN').value !== 'INSI-MANU') {
      throw new Error('The common name of the subject is not valid');
    }

    if (bag.issuer.getField('CN').value !== 'AC IGC-SANTE ELEMENTAIRE ORGANISATIONS' && bag.issuer.getField('CN').value !=='TEST AC IGC-SANTE ELEMENTAIRE ORGANISATIONS') {
      throw new Error('The common name of the issuer is not valid');
    }
    const now = new Date();

    if (bag.validity.notBefore > now || bag.validity.notAfter < now) {
      throw new Error(`The certificate expired or is for later use.\ncertificate dates: ${bag.validity.notBefore} - ${bag.validity.notAfter}`);
    }

    return {
      pfx,
      subjectCN: bag.subject.getField('CN').value,
      issuerCN: bag.issuer.getField('CN').value,
      validity: bag.validity,
    }
  }
}
