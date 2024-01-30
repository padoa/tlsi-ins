import { InsCertificateValidator } from './ins-certificate-validator.class';
import { PASSPHRASE } from '../models/env';
import fs from 'fs';
import { AssertionStatus, AssertionType, INSCertificateValidity } from '../models/ins-certificate-validator.models';

describe('Certificate', () => {
  test('should find an error if the passphrase is false', () => {
    const pfx = fs.readFileSync('certificates/INSI-MANU/MANU-certificate.p12');
    const response = InsCertificateValidator.validatePKCS12(pfx, 'false passphrase');
    expect(response).toMatchObject({certificateValidity: INSCertificateValidity.INVALID});
    expect(response.error).toEqual({message: 'PKCS#12 MAC could not be verified. Invalid password?'});
  });

  test('should find errors in the certificate', () => {
    const pfx = fs.readFileSync('certificates/bad-ssl/badssl.com-client.p12');
    const response = InsCertificateValidator.validatePKCS12(pfx, 'badssl.com');
    expect(response).toMatchObject(
      {
        certificateValidity: INSCertificateValidity.INVALID,
      }
    );
    expect(response.assertions).toEqual(
      [
        expect.objectContaining({
          type: AssertionType.SUBJECT_CN,
          status: AssertionStatus.FAIL,
          message: 'Subject\'s common name = BadSSL Client Certificate, it should be INSI-AUTO or INSI-MANU',
        }),
        expect.objectContaining({
          type: AssertionType.ISSUER_CN,
          status: AssertionStatus.FAIL,
          message: 'Issuer\'s common name = BadSSL Client Root Certificate Authority, it should be AC IGC-SANTE ELEMENTAIRE ORGANISATIONS or TEST AC IGC-SANTE ELEMENTAIRE ORGANISATIONS',
        }),
        expect.objectContaining({
          type: AssertionType.VALIDITY_DATES,
          status: AssertionStatus.SUCCESS,
        }),
      ]
    )
  });

  test('should be able to decrypt a certificate', () => {
    const pfx = fs.readFileSync('certificates/INSI-MANU/MANU-certificate.p12');
    const response = InsCertificateValidator.validatePKCS12(pfx, PASSPHRASE);
    expect(response).toMatchObject(
      {
        certificateValidity: INSCertificateValidity.VALID,
      }
    );
    expect(response.assertions).toEqual(
      [
        expect.objectContaining({status: AssertionStatus.SUCCESS}),
        expect.objectContaining({status: AssertionStatus.SUCCESS}),
        expect.objectContaining({status: AssertionStatus.SUCCESS}),
      ]
    )
  });
});
