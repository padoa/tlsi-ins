// import { InsCertificateValidator } from './ins-certificate-validator.class';
// import { PASSPHRASE } from '../models/env.ins';
// import fs from 'fs';
// import {
//   InsCertificateType,
//   InsCertificateValidity,
// } from '../models/ins-certificate-validator/ins-certificate-validator.models';
// import {
//   AssertionStatus,
//   InsAssertionType,
// } from '../models/ins-certificate-validator/ins-assertion.models';

describe('Certificate', () => {
  test('should return an error if the passphrase is false', () => {
    // const pfx = fs.readFileSync('certificates/INSI-MANU/MANU-certificate.p12');
    // const response = InsCertificateValidator.validatePKCS12(
    //   pfx,
    //   'false passphrase'
    // );

    // expect(response).toEqual({
    //   insCertificateValidity: InsCertificateValidity.INVALID,
    //   insCertificateType: null,
    //   certificate: null,
    //   error: {
    //     message: 'PKCS#12 MAC could not be verified. Invalid password?',
    //   },
    // });
  });

  // test('should return ins assertion errors if the certificate is invalid', () => {
  //   const pfx = fs.readFileSync('certificates/bad-ssl/badssl.com-client.p12');
  //   const response = InsCertificateValidator.validatePKCS12(pfx, 'badssl.com');

  //   expect(response).toEqual({
  //     insCertificateValidity: InsCertificateValidity.INVALID,
  //     insCertificateType: null,
  //     certificate: {
  //       base64: expect.any(String),
  //       subjectCN: 'BadSSL Client Certificate',
  //       issuerCN: 'BadSSL Client Root Certificate Authority',
  //       validity: {
  //         notBefore: new Date('2023-11-29T22:34:03.000Z'),
  //         notAfter: new Date('2025-11-28T22:34:03.000Z'),
  //       },
  //     },
  //     insAssertions: {
  //       [InsAssertionType.SUBJECT_CN]: {
  //         status: AssertionStatus.FAILURE,
  //         message:
  //           "Subject's common name: BadSSL Client Certificate, it should be INSI-AUTO or INSI-MANU",
  //       },
  //       [InsAssertionType.ISSUER_CN]: {
  //         status: AssertionStatus.FAILURE,
  //         message:
  //           "Issuer's common name: BadSSL Client Root Certificate Authority, it should be AC IGC-SANTE ELEMENTAIRE ORGANISATIONS or TEST AC IGC-SANTE ELEMENTAIRE ORGANISATIONS",
  //       },
  //       [InsAssertionType.VALIDITY_DATES]: {
  //         status: AssertionStatus.SUCCESS,
  //         message:
  //           'Certificate validity dates: \n\tnotBefore: 2023-11-29T22:34:03.000Z\n\tnotAfter: 2025-11-28T22:34:03.000Z',
  //       },
  //     },
  //   });
  // });

  // test('should be able to decrypt a certificate', () => {
  //   const pfx = fs.readFileSync('certificates/INSI-MANU/MANU-certificate.p12');
  //   const response = InsCertificateValidator.validatePKCS12(pfx, PASSPHRASE);
  //   expect(response).toEqual({
  //     insCertificateValidity: InsCertificateValidity.VALID,
  //     insCertificateType: InsCertificateType.INSI_MANU,
  //     certificate: {
  //       base64: expect.any(String),
  //       subjectCN: 'INSI-MANU',
  //       issuerCN: 'TEST AC IGC-SANTE ELEMENTAIRE ORGANISATIONS',
  //       validity: {
  //         notAfter: new Date('2024-12-01T15:18:56.000Z'),
  //         notBefore: new Date('2021-12-01T15:18:56.000Z'),
  //       },
  //     },
  //     insAssertions: {
  //       [InsAssertionType.SUBJECT_CN]: {
  //         status: AssertionStatus.SUCCESS,
  //         message: "Subject's common name: INSI-MANU",
  //       },
  //       [InsAssertionType.ISSUER_CN]: {
  //         status: AssertionStatus.SUCCESS,
  //         message:
  //           "Issuer's common name: TEST AC IGC-SANTE ELEMENTAIRE ORGANISATIONS",
  //       },
  //       [InsAssertionType.VALIDITY_DATES]: {
  //         status: AssertionStatus.SUCCESS,
  //         message:
  //           'Certificate validity dates: \n\tnotBefore: 2021-12-01T15:18:56.000Z\n\tnotAfter: 2024-12-01T15:18:56.000Z',
  //       },
  //     },
  //   });
  // });
});
