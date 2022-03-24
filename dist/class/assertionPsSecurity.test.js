"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const assertionPsSecurity_class_1 = require("./assertionPsSecurity.class");
const assertionPsSecurity_fixture_1 = require("../fixtures/assertionPsSecurity.fixture");
describe('Assertion PS', () => {
    test('should add AssertionPS security header to request with a private key with password', () => {
        const privateKey = fs_1.default.readFileSync('certificates/node-soap/agent2-key-with-password.pem').toString();
        const publicKey = fs_1.default.readFileSync('certificates/node-soap/agent2-cert.pem').toString();
        const password = 'soap';
        const assertion = new assertionPsSecurity_class_1.AssertionPsSecurityClass(privateKey, publicKey, password, {
            issuer: 'TODO string',
            nameQualifier: 'TODO string',
            nameId: 'TODO string',
            identifiantFacturation: 'TODO string',
            codeSpecialiteAMO: 'TODO string',
            secteurActivite: 'TODO string',
        });
        const processedXml = assertion.postProcess(assertionPsSecurity_fixture_1.xml, 'soap', { id: '_7e72450c-dec5-4c9d-823b-557b6a1278e9', dateTime: "2022-03-01T10:32:00Z" });
        expect(processedXml).toEqual(assertionPsSecurity_fixture_1.expectedXml);
    });
    test('should add AssertionPS security header to request with a private key without password', () => {
        const privateKey = fs_1.default.readFileSync('certificates/node-soap/agent2-key.pem').toString();
        const publicKey = fs_1.default.readFileSync('certificates/node-soap/agent2-cert.pem').toString();
        const assertion = new assertionPsSecurity_class_1.AssertionPsSecurityClass(privateKey, publicKey, '', {
            issuer: 'TODO string',
            nameQualifier: 'TODO string',
            nameId: 'TODO string',
            identifiantFacturation: 'TODO string',
            codeSpecialiteAMO: 'TODO string',
            secteurActivite: 'TODO string',
        });
        const processedXml = assertion.postProcess(assertionPsSecurity_fixture_1.xml, 'soap', { id: '_7e72450c-dec5-4c9d-823b-557b6a1278e9', dateTime: "2022-03-01T10:32:00Z" });
        expect(processedXml).toEqual(assertionPsSecurity_fixture_1.expectedXmlNoPass);
    });
});
//# sourceMappingURL=assertionPsSecurity.test.js.map