"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PKCS12Certificate = void 0;
const node_forge_1 = require("node-forge");
class PKCS12Certificate {
    static decryptCertificate(pfx, passPhrase) {
        var _a, _b;
        const certificate = pfx.toString('base64');
        const p12Der = node_forge_1.util.decode64(certificate);
        const p12Asn1 = node_forge_1.asn1.fromDer(p12Der);
        const p12 = node_forge_1.pkcs12.pkcs12FromAsn1(p12Asn1, passPhrase); // raise an error if certif/passphrase combination is invalid
        const bag = (_b = (_a = p12.getBags({
            bagType: node_forge_1.pki.oids.certBag,
        })[node_forge_1.pki.oids.certBag]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.cert;
        if (!bag) {
            throw new Error('The certificate\'s bag is undefined !');
        }
        const PKCS12Certificate = {
            pfx,
            subjectCN: bag.subject.getField('CN').value,
            issuerCN: bag.issuer.getField('CN').value,
            validity: bag.validity,
        };
        return PKCS12Certificate;
    }
    static validateINSCertificate(certificate) {
        if (certificate.subjectCN !== 'INSI-AUTO' && certificate.subjectCN !== 'INSI-MANU') {
            throw new Error('The common name of the subject is not valid for INS');
        }
        if (certificate.issuerCN !== 'AC IGC-SANTE ELEMENTAIRE ORGANISATIONS' && certificate.issuerCN !== 'TEST AC IGC-SANTE ELEMENTAIRE ORGANISATIONS') {
            throw new Error('The common name of the issuer is not valid for INS');
        }
        const now = new Date();
        if (certificate.validity.notBefore > now || certificate.validity.notAfter < now) {
            throw new Error(`The certificate expired or is for later use.\ncertificate dates: ${certificate.validity.notBefore} - ${certificate.validity.notAfter}`);
        }
    }
}
exports.PKCS12Certificate = PKCS12Certificate;
//# sourceMappingURL=pkcs12certificate.class.js.map