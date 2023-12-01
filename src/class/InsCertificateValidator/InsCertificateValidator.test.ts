import { InsCertificateValidator } from './InsCertificateValidator.class';
import { PASSPHRASE } from '../../models/env';
import fs from 'fs';
import { AssertionStatus, INSCertificateValidity } from './InsCertificateValidator.model';

describe('Certificate', () => {
  test('should throw an error if the passphrase is false', () => {
    const pfx = fs.readFileSync('certificates/INSI-MANU/MANU-certificate.p12');
    expect(() => InsCertificateValidator.validateINSCertificate(pfx, 'false passphrase'))
    .toThrow('PKCS#12 MAC could not be verified. Invalid password?');
  });

  test('should be able to decrypt a certificate', () => {
    const pfx = fs.readFileSync('certificates/INSI-MANU/MANU-certificate.p12');
    const response = InsCertificateValidator.validateINSCertificate(pfx, PASSPHRASE);
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
