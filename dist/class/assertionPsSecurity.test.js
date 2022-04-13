"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertionPsSecurity_class_1 = require("./assertionPsSecurity.class");
const assertionPsSecurity_fixture_1 = require("../fixtures/assertionPsSecurity.fixture");
describe('Assertion PS', () => {
    test('should add AssertionPS security header', () => {
        const assertion = new assertionPsSecurity_class_1.AssertionPsSecurityClass(assertionPsSecurity_fixture_1.assertionPs);
        const processedXml = assertion.postProcess(assertionPsSecurity_fixture_1.xml, 'soap');
        expect(processedXml).toEqual(assertionPsSecurity_fixture_1.expectedXml);
    });
});
//# sourceMappingURL=assertionPsSecurity.test.js.map