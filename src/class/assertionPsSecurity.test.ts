import fs from 'fs';
import { AssertionPsSecurityClass } from './assertionPsSecurity.class';
import { expectedXml, expectedXmlNoPass, xml } from '../fixtures/assertionPsSecurity.fixture';

describe('Assertion PS', () => {
  test('should add AssertionPS security header to request with a private key with password', () => {
    const privateKey = fs.readFileSync('certificates/node-soap/agent2-key-with-password.pem').toString();
    const publicKey = fs.readFileSync('certificates/node-soap/agent2-cert.pem').toString();
    const password = 'soap';

    const assertion = new AssertionPsSecurityClass(privateKey, publicKey, password, {
      issuer: 'TODO string',
      nameQualifier: 'TODO string',
      nameId: 'TODO string',
      identifiantFacturation: 'TODO string',
      codeSpecialiteAMO: 'TODO string',
      secteurActivite: 'TODO string',
    });
    const processedXml = assertion.postProcess(xml, 'soap', { id: '_7e72450c-dec5-4c9d-823b-557b6a1278e9', dateTime: "2022-03-01T10:32:00Z"})
    expect(processedXml).toEqual(expectedXml);
  });

  test('should add AssertionPS security header to request with a private key without password', () => {
    const privateKey = fs.readFileSync('certificates/node-soap/agent2-key.pem').toString();
    const publicKey = fs.readFileSync('certificates/node-soap/agent2-cert.pem').toString();

    const assertion = new AssertionPsSecurityClass(privateKey, publicKey, '', {
      issuer: 'TODO string',
      nameQualifier: 'TODO string',
      nameId: 'TODO string',
      identifiantFacturation: 'TODO string',
      codeSpecialiteAMO: 'TODO string',
      secteurActivite: 'TODO string',
    });
    const processedXml = assertion.postProcess(xml, 'soap', { id: '_7e72450c-dec5-4c9d-823b-557b6a1278e9', dateTime: "2022-03-01T10:32:00Z"})
    expect(processedXml).toEqual(expectedXmlNoPass);
  });
});
