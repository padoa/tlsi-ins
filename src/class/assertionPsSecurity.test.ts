import { AssertionPsSecurityClass } from './assertionPsSecurity.class';
import { expectedXml, assertionPs, xml } from '../fixtures/assertionPsSecurity.fixture';

describe('Assertion PS', () => {
  test('should add AssertionPS security header', () => {
    const assertion = new AssertionPsSecurityClass(assertionPs);
    const processedXml = assertion.postProcess(xml, 'soap');
    expect(processedXml).toEqual(expectedXml);
  });
});
