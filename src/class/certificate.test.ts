import { Certificate } from './certificate.class';
import { PASSPHRASE } from '../models/env';

describe('Certificate', () => {
  test('should throw an error if the passphrase is false', () => {
    expect(() => Certificate.decryptCertificate('certificates/INSI-MANU/MANU-certificate.p12', 'false passphrase'))
    .toThrow('PKCS#12 MAC could not be verified. Invalid password?');
  });

  test('should be able to decrypt a certificate', () => {
    expect(Certificate.decryptCertificate('certificates/INSI-MANU/MANU-certificate.p12', PASSPHRASE)).toMatchObject(
      {
        subjectCN: 'INSI-MANU',
        issuerCN: 'TEST AC IGC-SANTE ELEMENTAIRE ORGANISATIONS',
        validity: {
          notBefore: new Date('2021-12-01T15:18:56.000Z'),
          notAfter: new Date('2024-12-01T15:18:56.000Z'),
        },
      }
    );
  });
});
