"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ins_certificate_validator_class_1 = require("./ins-certificate-validator.class");
const env_1 = require("../models/env");
const fs_1 = __importDefault(require("fs"));
const ins_certificate_validator_models_1 = require("../models/ins-certificate-validator.models");
describe('Certificate', () => {
    test('should find an error if the passphrase is false', () => {
        const pfx = fs_1.default.readFileSync('certificates/INSI-MANU/MANU-certificate.p12');
        const response = ins_certificate_validator_class_1.InsCertificateValidator.validatePKCS12(pfx, 'false passphrase');
        expect(response).toMatchObject({ certificateValidity: ins_certificate_validator_models_1.INSCertificateValidity.INVALID });
        expect(response.error).toEqual({ message: 'PKCS#12 MAC could not be verified. Invalid password?' });
    });
    test('should find errors in the certificate', () => {
        const pfx = fs_1.default.readFileSync('certificates/bad-ssl/badssl.com-client.p12');
        const response = ins_certificate_validator_class_1.InsCertificateValidator.validatePKCS12(pfx, 'badssl.com');
        expect(response).toMatchObject({
            certificateValidity: ins_certificate_validator_models_1.INSCertificateValidity.INVALID,
        });
        expect(response.assertions).toEqual([
            expect.objectContaining({
                type: ins_certificate_validator_models_1.AssertionType.SUBJECT_CN,
                status: ins_certificate_validator_models_1.AssertionStatus.FAIL,
                message: 'Subject\'s common name = BadSSL Client Certificate, it should be INSI-AUTO or INSI-MANU',
            }),
            expect.objectContaining({
                type: ins_certificate_validator_models_1.AssertionType.ISSUER_CN,
                status: ins_certificate_validator_models_1.AssertionStatus.FAIL,
                message: 'Issuer\'s common name = BadSSL Client Root Certificate Authority, it should be AC IGC-SANTE ELEMENTAIRE ORGANISATIONS or TEST AC IGC-SANTE ELEMENTAIRE ORGANISATIONS',
            }),
            expect.objectContaining({
                type: ins_certificate_validator_models_1.AssertionType.VALIDITY_DATES,
                status: ins_certificate_validator_models_1.AssertionStatus.SUCCESS,
            }),
        ]);
    });
    test('should be able to decrypt a certificate', () => {
        const pfx = fs_1.default.readFileSync('certificates/INSI-MANU/MANU-certificate.p12');
        const response = ins_certificate_validator_class_1.InsCertificateValidator.validatePKCS12(pfx, env_1.PASSPHRASE);
        expect(response).toMatchObject({
            certificateValidity: ins_certificate_validator_models_1.INSCertificateValidity.VALID,
        });
        expect(response.assertions).toEqual([
            expect.objectContaining({ status: ins_certificate_validator_models_1.AssertionStatus.SUCCESS }),
            expect.objectContaining({ status: ins_certificate_validator_models_1.AssertionStatus.SUCCESS }),
            expect.objectContaining({ status: ins_certificate_validator_models_1.AssertionStatus.SUCCESS }),
        ]);
    });
});
//# sourceMappingURL=ins-certificate-validator.js.map