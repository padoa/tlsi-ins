"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsCertificateValidator = void 0;
const node_forge_1 = require("node-forge");
const ins_certificate_validator_models_1 = require("../models/ins-certificate-validator.models");
class InsCertificateValidator {
    static _decryptCertificate(pfx, passPhrase) {
        var _a, _b;
        const pfxB64 = pfx.toString('base64');
        const p12Der = node_forge_1.util.decode64(pfxB64);
        const p12Asn1 = node_forge_1.asn1.fromDer(p12Der);
        let p12;
        try {
            p12 = node_forge_1.pkcs12.pkcs12FromAsn1(p12Asn1, passPhrase); // raise an error if certif/passphrase combination is invalid
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
            pfx: pfxB64,
            subjectCN: bag.subject.getField('CN').value,
            issuerCN: bag.issuer.getField('CN').value,
            validity: bag.validity,
        };
        return { certificate: PKCS12Certificate, error: null };
    }
    static validatePKCS12(pfx, passPhrase) {
        const { certificate, error } = this._decryptCertificate(pfx, passPhrase);
        if (error !== null || certificate === null) {
            return {
                certificateValidity: ins_certificate_validator_models_1.INSCertificateValidity.INVALID,
                assertions: [],
                error: { message: error ? error : 'The certificate is null without error message' },
                metadata: { endDate: new Date(0), certificateType: ins_certificate_validator_models_1.ICertificateType.OTHER },
            };
        }
        const assertions = [];
        const isSubjectCnValid = certificate.subjectCN == (ins_certificate_validator_models_1.ICertificateType.INSI_AUTO || ins_certificate_validator_models_1.ICertificateType.INSI_MANU);
        const subjectCnFailedMessage = isSubjectCnValid ? '' : `, it should be ${ins_certificate_validator_models_1.ICertificateType.INSI_AUTO} or ${ins_certificate_validator_models_1.ICertificateType.INSI_MANU}`;
        const subjectCnMessage = `Subject's common name = ${certificate.subjectCN}` + subjectCnFailedMessage;
        const isIssuerCnValid = certificate.issuerCN == (ins_certificate_validator_models_1.InsIssuerCn.AC_IGC_SANTE || ins_certificate_validator_models_1.InsIssuerCn.TEST_AC_IGC_SANTE);
        const issuerFailedMessage = isIssuerCnValid ? '' : `, it should be ${ins_certificate_validator_models_1.InsIssuerCn.AC_IGC_SANTE} or ${ins_certificate_validator_models_1.InsIssuerCn.TEST_AC_IGC_SANTE}`;
        const issuerCnMessage = `Issuer's common name = ${certificate.issuerCN}` + issuerFailedMessage;
        const now = new Date();
        const isCertificateDateValid = certificate.validity.notBefore < now && certificate.validity.notAfter > now;
        const certificateExpiredMessage = isCertificateDateValid ? '' : 'The certificate expired or is for later use\n';
        const certificateDateMessage = certificateExpiredMessage + `certificate dates: ${JSON.stringify(certificate.validity)}`;
        const getAssertionStatus = ((value) => value ? ins_certificate_validator_models_1.AssertionStatus.SUCCESS : ins_certificate_validator_models_1.AssertionStatus.FAIL);
        assertions.push({
            type: ins_certificate_validator_models_1.AssertionType.SUBJECT_CN,
            status: getAssertionStatus(isSubjectCnValid),
            message: subjectCnMessage,
        });
        assertions.push({
            type: ins_certificate_validator_models_1.AssertionType.ISSUER_CN,
            status: getAssertionStatus(isIssuerCnValid),
            message: issuerCnMessage,
        });
        assertions.push({
            type: ins_certificate_validator_models_1.AssertionType.VALIDITY_DATES,
            status: getAssertionStatus(isCertificateDateValid),
            message: certificateDateMessage
        });
        const metadata = {
            endDate: certificate.validity.notAfter,
            certificateType: isSubjectCnValid ? certificate.issuerCN : ins_certificate_validator_models_1.ICertificateType.OTHER,
        };
        const certificateValidity = assertions.some((assertion) => assertion.status === ins_certificate_validator_models_1.AssertionStatus.FAIL) ? ins_certificate_validator_models_1.INSCertificateValidity.VALID : ins_certificate_validator_models_1.INSCertificateValidity.INVALID;
        return {
            certificateValidity,
            assertions,
            metadata,
        };
    }
}
exports.InsCertificateValidator = InsCertificateValidator;
//# sourceMappingURL=ins-certificate-validator.class.js.map