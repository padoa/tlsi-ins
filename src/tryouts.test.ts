import fs from 'fs';
import https from 'https';
import axios, { AxiosError } from 'axios';
import { combineCACertAsPem, PASSPHRASE, readCACertAsPem } from './certificates';
import { INSSoapClientService, INSIdentityTraits } from './ins-soap-client.service';

describe('Convert CA cert to PEM', () => {
  // Make sure we are compatible with Windows line endings
  const ACI_EL_ORG_PEM_CERTIFICATE = fs.readFileSync('src/fixtures/ACI_EL_ORG_PEM_CERTIFICATE.pem.fixture', 'utf-8').replace(/\n/g, '\r\n');
  const ACR_EL_PEM_CERTIFICATE = fs.readFileSync('src/fixtures/ACR_EL_PEM_CERTIFICATE.pem.fixture', 'utf-8').replace(/\n/g, '\r\n');

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


const pfx = fs.readFileSync('certificates/INSI-AUTO/AUTO-certificate.p12');

describe('Using the p12 directly with axios', () => {
  test('should error out when the software authorization number is unknown', (done) => {
    const fakePayload = fs.readFileSync('src/fixtures/fake_payload.xml', 'utf-8');
    const httpsAgent = new https.Agent({
      pfx,
      passphrase: PASSPHRASE,
      ca: combineCACertAsPem([
        'certificates/ca/ACR-EL.cer',
        'certificates/ca/ACI-EL-ORG.cer',
      ]),
    });

    axios.post('https://qualiflps-services-ps-tlsm.ameli.fr:443/lps', fakePayload, {
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

describe('Using the p12 directly with node-soap', () => {
  let soapClient: INSSoapClientService;

  test('should initialize the soap client', async () => {
    soapClient = new INSSoapClientService({
      softwareName: 'padoa',
      softwareVersion: '2022',
      emitter: '10B0152872',
      IDAMAutorisationNumber: 'NumAuthorization',
      pfx,
      passphrase: PASSPHRASE,
    })
    await soapClient.initialize();
  });

  test('should error out when the software authorization number is unknown', async () => {
    const fakePayload: INSIdentityTraits = {
      lastName: 'ADRDEUX',
      firstName: 'LAURENT',
      gender: 'M',
      birthdate: new Date('1981-11-01'),
    };

      const res = await soapClient.INSSearchFromIdentityTraits(fakePayload);
      console.log('RESPONSE CONTENT\n\n', res.result.data);
      expect(res.result.status).toBe(500);
      expect(res.result.data).toContain(`Numéro d'autorisation du logiciel inconnu.`);
  });
});
