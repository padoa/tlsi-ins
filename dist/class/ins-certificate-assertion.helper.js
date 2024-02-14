"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsCertificateAssertionHelper = void 0;
const ins_assertion_models_1 = require("../models/ins-certificate-validator/ins-assertion.models");
class InsCertificateAssertionHelper {
    static checkInsAssertionForCertificate(certificate) {
        return {
            [ins_assertion_models_1.InsAssertionType.SUBJECT_CN]: this._validateSubjectCn(certificate),
            [ins_assertion_models_1.InsAssertionType.ISSUER_CN]: this._validateIssuerCn(certificate),
            [ins_assertion_models_1.InsAssertionType.VALIDITY_DATES]: this._validateValidityDates(certificate),
        };
    }
    static _validateSubjectCn(certificate) {
        const subjectCnIsValid = this.insCertificateValidType.includes(certificate.subjectCN);
        return {
            status: subjectCnIsValid ? ins_assertion_models_1.AssertionStatus.SUCCESS : ins_assertion_models_1.AssertionStatus.FAILURE,
            message: `Subject's common name: ${certificate.subjectCN}` + (subjectCnIsValid ? '' : `, it should be ${ins_assertion_models_1.InsCertificateSubjectCn.INSI_AUTO} or ${ins_assertion_models_1.InsCertificateSubjectCn.INSI_MANU}`),
        };
    }
    static _validateIssuerCn(certificate) {
        const issuerCnIsValid = this.insCertificateValidIssuerCn.includes(certificate.issuerCN);
        return {
            status: issuerCnIsValid ? ins_assertion_models_1.AssertionStatus.SUCCESS : ins_assertion_models_1.AssertionStatus.FAILURE,
            message: `Issuer's common name: ${certificate.issuerCN}` + (issuerCnIsValid ? '' : `, it should be ${ins_assertion_models_1.InsCertificateIssuerCn.AC_IGC_SANTE} or ${ins_assertion_models_1.InsCertificateIssuerCn.TEST_AC_IGC_SANTE}`),
        };
    }
    static _validateValidityDates(certificate) {
        const now = new Date();
        const dateIsValid = certificate.validity.notBefore < now && certificate.validity.notAfter > now;
        return {
            status: dateIsValid ? ins_assertion_models_1.AssertionStatus.SUCCESS : ins_assertion_models_1.AssertionStatus.FAILURE,
            message: `Certificate validity dates: ${this._getValidityDatesMessage(certificate.validity)}` + (dateIsValid ? '' : `, the certificate expired or is for later use`),
        };
    }
    static _getValidityDatesMessage(validity) {
        return `\n\tnotBefore: ${validity.notBefore.toISOString()}\n\tnotAfter: ${validity.notAfter.toISOString()}`;
    }
}
exports.InsCertificateAssertionHelper = InsCertificateAssertionHelper;
InsCertificateAssertionHelper.insCertificateValidIssuerCn = [ins_assertion_models_1.InsCertificateIssuerCn.AC_IGC_SANTE, ins_assertion_models_1.InsCertificateIssuerCn.TEST_AC_IGC_SANTE];
InsCertificateAssertionHelper.insCertificateValidType = [ins_assertion_models_1.InsCertificateSubjectCn.INSI_AUTO, ins_assertion_models_1.InsCertificateSubjectCn.INSI_MANU];
//# sourceMappingURL=ins-certificate-assertion.helper.js.map