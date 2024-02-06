"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsCertificateValidator = void 0;
const node_forge_1 = require("node-forge");
const ins_certificate_validator_models_1 = require("../models/ins-certificate-validator/ins-certificate-validator.models");
const ins_certificate_assertion_helper_1 = require("./ins-certificate-assertion.helper");
class InsCertificateValidator {
    /**
     * Open the certificate with passphrase
     * @param  {Buffer} pfx certificate in p12/pfx format
     * @param  {string} passphrase the passphrase used to decipher the certificate
     * @returns {PKCS12Certificate | null} the certificate information or null if the passphrase is invalid
     */
    static _openPKCS12Certificate(pfx, passphrase) {
        var _a, _b;
        const pfxB64 = pfx.toString('base64');
        const p12Der = node_forge_1.util.decode64(pfxB64);
        const p12Asn1 = node_forge_1.asn1.fromDer(p12Der);
        let p12;
        try {
            p12 = node_forge_1.pkcs12.pkcs12FromAsn1(p12Asn1, passphrase); // raise an error if certif/passphrase combination is invalid
        }
        catch (error) {
            if (error instanceof Error) {
                return { certificate: null, error: error.message };
            }
            else {
                return { certificate: null, error: 'Unknown error' };
            }
        }
        const bag = (_b = (_a = p12.getBags({
            bagType: node_forge_1.pki.oids.certBag,
        })[node_forge_1.pki.oids.certBag]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.cert;
        if (!bag) {
            return { certificate: null, error: 'The certificate\'s bag is undefined !' };
        }
        const PKCS12Certificate = {
            base64: pfxB64,
            subjectCN: bag.subject.getField('CN').value,
            issuerCN: bag.issuer.getField('CN').value,
            validity: bag.validity,
        };
        return { certificate: PKCS12Certificate, error: null };
    }
    /**
     * Validate the PKCS12 Certificate for INS use
     * @param  {Buffer} pfx contains the Ins Certificate in p12/pfx format
     * @param  {string} passphrase the passphrase used to decipher the certificate
     * @returns {InsCertificateValidationResponse} the ins validation response
     * */
    static validatePKCS12(pfx, passphrase) {
        const { certificate, error } = this._openPKCS12Certificate(pfx, passphrase);
        if (error !== null || certificate === null) {
            return {
                insCertificateValidity: ins_certificate_validator_models_1.InsCertificateValidity.INVALID,
                insAssertions: [],
                certificate,
                error: { message: error !== null && error !== void 0 ? error : 'The certificate is null without error message' },
            };
        }
        const { insAssertions, insCertificateValidity } = ins_certificate_assertion_helper_1.InsCertificateAssertionHelper.testCertificateForIns(certificate);
        return {
            insCertificateValidity,
            certificate,
            insAssertions,
        };
    }
}
exports.InsCertificateValidator = InsCertificateValidator;
//# sourceMappingURL=ins-certificate-validator.class.js.map