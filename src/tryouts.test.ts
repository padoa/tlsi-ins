import fs from 'fs';
import https from 'https';
import axios, { AxiosError } from 'axios';
import { combineCACertAsPem, PASSPHRASE, readCACertAsPem } from './certificates';

// Make sure we are compatible with Windows line endings
const ACI_EL_ORG_PEM_CERTIFICATE = fs.readFileSync('src/fixtures/ACI_EL_ORG_PEM_CERTIFICATE.pem.fixture', 'utf-8').replace(/\n/g, '\r\n');
const ACR_EL_PEM_CERTIFICATE = fs.readFileSync('src/fixtures/ACR_EL_PEM_CERTIFICATE.pem.fixture', 'utf-8').replace(/\n/g, '\r\n');
const FAKE_PAYLOAD = fs.readFileSync('src/fixtures/fake_payload.xml', 'utf-8');

describe('Convert CA cert to PEM', () => {
  test('convert a single file', () => {
    const pem = readCACertAsPem('certificates/ca/ACI-EL-ORG.cer');

    expect(pem).toStrictEqual(ACI_EL_ORG_PEM_CERTIFICATE);
  });

  test('convert multiple files and concat', () => {
    const certChain = combineCACertAsPem([
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

describe('Using the p12 directly', () => {
  const pfx = fs.readFileSync('certificates/INSI-AUTO/AUTO-certificate.p12');

  test('should error out when the software authorization number is unknown', (done) => {
    const httpsAgent = new https.Agent({
      pfx,
      passphrase: PASSPHRASE,
      ca: combineCACertAsPem([
        'certificates/ca/ACR-EL.cer',
        'certificates/ca/ACI-EL-ORG.cer',
      ]),
    });

    axios.post('https://qualiflps-services-ps-tlsm.ameli.fr:443/lps', FAKE_PAYLOAD, {
      httpsAgent,
      headers: {
        'Content-Type': 'application/soap+xml;charset=utf-8',
      },
    })
      .then((res) => {
        console.log('[We should not end up here]', res);
        done();
      })
      .catch((e: AxiosError<any>) => {
        const xmlAsString = e.response?.data;
        console.log('RESPONSE CONTENT\n\n', xmlAsString);
        expect(e.response?.status).toBe(500);
        expect(xmlAsString).toContain(`Numéro d'autorisation du logiciel inconnu.`);
        done();
      });
  });
});
