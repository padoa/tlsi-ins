import fs from 'fs';
import https from 'https';
import axios, { AxiosError } from 'axios';
import { combineCACertAsPem, readCACertAsPem } from './utils/certificates';
import { IDAM, PASSPHRASE, SOFTWARE_NAME, SOFTWARE_VERSION } from './models/env';
import { INSiClient } from './insi-client.service';
import { LPS } from './class/lps.class';
import { LpsContext } from './class/lps-context.class';
import { BamContext } from './class/bam-context.class';
import { Gender, INSiPerson } from './class/insi-person.class';

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

describe.only('INSi client', () => {
  let insiClient: INSiClient;

  test('should be able to create a new INSi client', async () => {
    const lps = new LPS({
      idam: IDAM as string,
      version: SOFTWARE_VERSION as string,
      name: SOFTWARE_NAME as string,
    });

    const lpsContext = new LpsContext({
      emitter: 'medecin@yopmail.com',
      lps,
    });

    const bamContext = new BamContext({
      emitter: 'medecin@yopmail.com',
    });

    insiClient = new INSiClient({
      lpsContext,
      bamContext,
      passphrase: PASSPHRASE,
      pfx,
    });

    await insiClient.initialize();
  }, 10000);

  test('should be able to call fetchIdentity', async () => {
    const person = new INSiPerson({
      lastName: 'ADRTROIS',
      firstName: 'DOMINIQUE',
      gender: Gender.Female,
      dateOfBirth: '1997-02-26',
    });

    const { requestId, responseAsJson } = await insiClient.fetchIdentity(person);

    expect(responseAsJson).toEqual({
      CR: {
        CodeCR: '00',
        LibelleCR: 'OK'
      },
      INDIVIDU: {
        INSACTIF: {
          IdIndividu: {
            NumIdentifiant: '297022A020778',
            Cle: '78'
          },
          OID: '1.2.250.1.213.1.4.8'
        },
        TIQ: {
          NomNaissance: 'ADRTROIS',
          Prenom: 'DOMINIQUE',
          ListePrenom: 'DOMINIQUE',
          Sexe: 'F',
          DateNaissance: '1997-02-26',
          LieuNaissance: '20020'
        }
      }
    });
  });
});
