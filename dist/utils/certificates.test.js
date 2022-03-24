"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const certificates_1 = require("./certificates");
describe('Convert CA cert to PEM', () => {
    // Make sure we are compatible with Windows line endings
    const ACI_EL_ORG_PEM_CERTIFICATE = fs_1.default.readFileSync('src/fixtures/ACI_EL_ORG_PEM_CERTIFICATE.pem.fixture', 'utf-8').replace(/\n/g, '\r\n');
    const ACR_EL_PEM_CERTIFICATE = fs_1.default.readFileSync('src/fixtures/ACR_EL_PEM_CERTIFICATE.pem.fixture', 'utf-8').replace(/\n/g, '\r\n');
    test('convert a single file', () => {
        const pem = (0, certificates_1.readCertAsPem)('certificates/ca/ACI-EL-ORG.cer');
        expect(pem).toStrictEqual(ACI_EL_ORG_PEM_CERTIFICATE);
    });
    test('convert multiple files and concat', () => {
        const certChain = (0, certificates_1.combineCertAsPem)([
            'certificates/ca/ACI-EL-ORG.cer',
            'certificates/ca/ACR-EL.cer',
        ]);
        const expected = [
            ACI_EL_ORG_PEM_CERTIFICATE,
            ACR_EL_PEM_CERTIFICATE,
        ].join('');
        expect(certChain).toEqual(expected);
    });
});
//# sourceMappingURL=certificates.test.js.map