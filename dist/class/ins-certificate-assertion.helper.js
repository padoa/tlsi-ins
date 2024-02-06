"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsCertificateAssertionHelper = void 0;
const ins_certificate_validator_models_1 = require("../models/ins-certificate-validator/ins-certificate-validator.models");
const ins_assertion_models_1 = require("../models/ins-certificate-validator/ins-assertion.models");
class InsCertificateAssertionHelper {
    static testCertificateForIns(certificate) {
        const insAssertions = this.insCertificateAssertions.map((assertionType) => this._validateAssertion(assertionType, certificate));
        return {
            insCertificateValidity: insAssertions.every(({ status }) => status === ins_assertion_models_1.AssertionStatus.SUCCESS) ? ins_certificate_validator_models_1.InsCertificateValidity.VALID : ins_certificate_validator_models_1.InsCertificateValidity.INVALID,
            insAssertions,
        };
    }
    static _validateAssertion(type, certificate) {
        switch (type) {
            case ins_assertion_models_1.InsAssertionType.SUBJECT_CN:
                return this._validateSubjectCn(certificate);
            case ins_assertion_models_1.InsAssertionType.ISSUER_CN:
                return this._validateIssuerCn(certificate);
            case ins_assertion_models_1.InsAssertionType.VALIDITY_DATES:
                return this._validateValidityDates(certificate);
            default:
                return {
                    type: ins_assertion_models_1.InsAssertionType.UNKNOWN,
                    status: ins_assertion_models_1.AssertionStatus.FAILURE,
                    message: 'Invalid assertion type',
                };
        }
    }
    static _validateSubjectCn(certificate) {
        const isSubjectCnValid = this.insCertificateValidType.includes(certificate.subjectCN);
        return {
            type: ins_assertion_models_1.InsAssertionType.SUBJECT_CN,
            status: isSubjectCnValid ? ins_assertion_models_1.AssertionStatus.SUCCESS : ins_assertion_models_1.AssertionStatus.FAILURE,
            message: `Subject's common name: ${certificate.subjectCN}` + (isSubjectCnValid ? '' : `, it should be ${ins_assertion_models_1.InsCertificateSubjectCn.INSI_AUTO} or ${ins_assertion_models_1.InsCertificateSubjectCn.INSI_MANU}`),
        };
    }
    static _validateIssuerCn(certificate) {
        const isIssuerCnValid = this.insCertificateValidIssuerCn.includes(certificate.issuerCN);
        return {
            type: ins_assertion_models_1.InsAssertionType.ISSUER_CN,
            status: isIssuerCnValid ? ins_assertion_models_1.AssertionStatus.SUCCESS : ins_assertion_models_1.AssertionStatus.FAILURE,
            message: `Issuer's common name: ${certificate.issuerCN}` + (isIssuerCnValid ? '' : `, it should be ${ins_assertion_models_1.InsCertificateIssuerCn.AC_IGC_SANTE} or ${ins_assertion_models_1.InsCertificateIssuerCn.TEST_AC_IGC_SANTE}`),
        };
    }
    static _validateValidityDates(certificate) {
        const now = new Date();
        const isDateValid = certificate.validity.notBefore < now && certificate.validity.notAfter > now;
        return {
            type: ins_assertion_models_1.InsAssertionType.VALIDITY_DATES,
            status: isDateValid ? ins_assertion_models_1.AssertionStatus.SUCCESS : ins_assertion_models_1.AssertionStatus.FAILURE,
            message: `Certificate validity dates: ${this._getValidityDatesMessage(certificate.validity)}` + (isDateValid ? '' : `, the certificate expired or is for later use`),
        };
    }
    static _getValidityDatesMessage(validity) {
        return `\n\tnotBefore: ${validity.notBefore.toISOString()}\n\tnotAfter: ${validity.notAfter.toISOString()}`;
    }
}
exports.InsCertificateAssertionHelper = InsCertificateAssertionHelper;
InsCertificateAssertionHelper.insCertificateValidIssuerCn = [ins_assertion_models_1.InsCertificateIssuerCn.AC_IGC_SANTE, ins_assertion_models_1.InsCertificateIssuerCn.TEST_AC_IGC_SANTE];
InsCertificateAssertionHelper.insCertificateValidType = [ins_assertion_models_1.InsCertificateSubjectCn.INSI_AUTO, ins_assertion_models_1.InsCertificateSubjectCn.INSI_MANU];
InsCertificateAssertionHelper.insCertificateAssertions = [ins_assertion_models_1.InsAssertionType.SUBJECT_CN, ins_assertion_models_1.InsAssertionType.ISSUER_CN, ins_assertion_models_1.InsAssertionType.VALIDITY_DATES];
//# sourceMappingURL=ins-certificate-assertion.helper.js.map