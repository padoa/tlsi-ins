import { PKCS12Certificate } from './pkcs12certificate.class';
import { PASSPHRASE } from '../models/env';
import fs from 'fs';

describe('Certificate', () => {
  test('should throw an error if the passphrase is false', () => {
    const pfx = fs.readFileSync('certificates/INSI-MANU/MANU-certificate.p12');
    expect(() => PKCS12Certificate.decryptCertificate(pfx, 'false passphrase'))
    .toThrow('PKCS#12 MAC could not be verified. Invalid password?');
  });

  test('should be able to decrypt a certificate', () => {
    const pfx = fs.readFileSync('certificates/INSI-MANU/MANU-certificate.p12');
    expect(PKCS12Certificate.decryptCertificate(pfx, PASSPHRASE)).toMatchObject(
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
