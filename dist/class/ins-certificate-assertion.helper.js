"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsCertificateAssertionHelper = void 0;
const ins_certificate_validator_models_1 = require("../models/ins-certificate-validator/ins-certificate-validator.models");
const ins_assertion_models_1 = require("../models/ins-certificate-validator/ins-assertion.models");
class InsCertificateAssertionHelper {
    static testCertificateForIns(certificate) {
        const insAssertions = Object.values(ins_assertion_models_1.InsAssertionType).reduce((insAssertions, type) => (Object.assign(Object.assign({}, insAssertions), { [type]: this._validateAssertion(type, certificate) })), {});
        return {
            insCertificateValidity: Object.values(insAssertions).every(({ status }) => status === ins_assertion_models_1.AssertionStatus.SUCCESS) ? ins_certificate_validator_models_1.InsCertificateValidity.VALID : ins_certificate_validator_models_1.InsCertificateValidity.INVALID,
            insCertificateType: this._getInsCertificateType(certificate),
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
                    status: ins_assertion_models_1.AssertionStatus.FAILURE,
                    message: 'Invalid assertion type',
                };
        }
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
    static _getInsCertificateType(certificate) {
        switch (certificate.subjectCN) {
            case ins_assertion_models_1.InsCertificateSubjectCn.INSI_AUTO:
                return ins_certificate_validator_models_1.InsCertificateType.INSI_AUTO;
            case ins_assertion_models_1.InsCertificateSubjectCn.INSI_MANU:
                return ins_certificate_validator_models_1.InsCertificateType.INSI_MANU;
            default:
                return ins_certificate_validator_models_1.InsCertificateType.UNKNOWN;
        }
    }
}
exports.InsCertificateAssertionHelper = InsCertificateAssertionHelper;
InsCertificateAssertionHelper.insCertificateValidIssuerCn = [ins_assertion_models_1.InsCertificateIssuerCn.AC_IGC_SANTE, ins_assertion_models_1.InsCertificateIssuerCn.TEST_AC_IGC_SANTE];
InsCertificateAssertionHelper.insCertificateValidType = [ins_assertion_models_1.InsCertificateSubjectCn.INSI_AUTO, ins_assertion_models_1.InsCertificateSubjectCn.INSI_MANU];
//# sourceMappingURL=ins-certificate-assertion.helper.js.map