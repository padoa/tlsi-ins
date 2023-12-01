"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsCertificateValidator = void 0;
const node_forge_1 = require("node-forge");
const InsCertificateValidator_model_1 = require("./InsCertificateValidator.model");
class InsCertificateValidator {
    static _decryptCertificate(pfx, passPhrase) {
        var _a, _b;
        const pfxB64 = pfx.toString('base64');
        const p12Der = node_forge_1.util.decode64(pfxB64);
        const p12Asn1 = node_forge_1.asn1.fromDer(p12Der);
        const p12 = node_forge_1.pkcs12.pkcs12FromAsn1(p12Asn1, passPhrase); // raise an error if certif/passphrase combination is invalid
        const bag = (_b = (_a = p12.getBags({
            bagType: node_forge_1.pki.oids.certBag,
        })[node_forge_1.pki.oids.certBag]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.cert;
        if (!bag) {
            throw new Error('The certificate\'s bag is undefined !');
        }
        const PKCS12Certificate = {
            pfx: pfxB64,
            subjectCN: bag.subject.getField('CN').value,
            issuerCN: bag.issuer.getField('CN').value,
            validity: bag.validity,
        };
        return PKCS12Certificate;
    }
    static validatePKCS12(pfx, passPhrase) {
        const certificate = this._decryptCertificate(pfx, passPhrase);
        let certificateValidity = InsCertificateValidator_model_1.INSCertificateValidity.VALID;
        const assertions = [];
        if (certificate.subjectCN !== 'INSI-AUTO' && certificate.subjectCN !== 'INSI-MANU') {
            assertions.push({
                type: InsCertificateValidator_model_1.AssertionType.SUBJECT_CN,
                status: InsCertificateValidator_model_1.AssertionStatus.FAIL,
                message: 'The common name of the subject is not valid for INS, it should be INSI-AUTO or INSI-MANU',
            });
            certificateValidity = InsCertificateValidator_model_1.INSCertificateValidity.INVALID;
        }
        else {
            assertions.push({
                type: InsCertificateValidator_model_1.AssertionType.SUBJECT_CN,
                status: InsCertificateValidator_model_1.AssertionStatus.SUCCESS,
                message: `Subjec's common name = ${certificate.subjectCN}`,
            });
        }
        if (certificate.issuerCN !== 'AC IGC-SANTE ELEMENTAIRE ORGANISATIONS' && certificate.issuerCN !== 'TEST AC IGC-SANTE ELEMENTAIRE ORGANISATIONS') {
            assertions.push({
                type: InsCertificateValidator_model_1.AssertionType.ISSUER_CN,
                status: InsCertificateValidator_model_1.AssertionStatus.FAIL,
                message: 'The common name of the issuer is not valid for INS, it should be AC IGC-SANTE ELEMENTAIRE ORGANISATIONS or TEST AC IGC-SANTE ELEMENTAIRE ORGANISATIONS',
            });
            certificateValidity = InsCertificateValidator_model_1.INSCertificateValidity.INVALID;
        }
        else {
            assertions.push({
                type: InsCertificateValidator_model_1.AssertionType.ISSUER_CN,
                status: InsCertificateValidator_model_1.AssertionStatus.SUCCESS,
                message: `Issuer's common name = ${certificate.issuerCN}`,
            });
        }
        const now = new Date();
        if (certificate.validity.notBefore > now || certificate.validity.notAfter < now) {
            assertions.push({
                type: InsCertificateValidator_model_1.AssertionType.VAILIDITY_DATES,
                status: InsCertificateValidator_model_1.AssertionStatus.FAIL,
                message: `The certificate expired or is for later use.\ncertificate dates: ${certificate.validity.notBefore} - ${certificate.validity.notAfter}`,
            });
            certificateValidity = InsCertificateValidator_model_1.INSCertificateValidity.INVALID;
        }
        else {
            assertions.push({
                type: InsCertificateValidator_model_1.AssertionType.VAILIDITY_DATES,
                status: InsCertificateValidator_model_1.AssertionStatus.SUCCESS,
                message: `validity = ${JSON.stringify(certificate.validity)}`,
            });
        }
        return {
            certificateValidity,
            assertions,
        };
    }
}
exports.InsCertificateValidator = InsCertificateValidator;
//# sourceMappingURL=InsCertificateValidator.class.js.map