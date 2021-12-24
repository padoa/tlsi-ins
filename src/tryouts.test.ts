import fs from 'fs';
import https from 'https';
import axios, { AxiosError } from 'axios';
import {
  createClientAsync,
  ClientSSLSecurityPFX,
} from 'soap';
import { combineCACertAsPem, PASSPHRASE, readCACertAsPem } from './certificates';

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

describe('Using the p12 directly', () => {
  const pfx = fs.readFileSync('certificates/INSI-AUTO/AUTO-certificate.p12');

  test('should error out when the software authorization number is unknown using axios', (done) => {
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

  test('should error out when the software authorization number is unknown using node-soap', async () => {
    const fakePayload = {
      NomNaissance: 'ADRDEUX',
      Prenom: 'LAURENT',
      Sexe: 'M',
      DateNaissance: '1981 - 01 - 01',
    };

    const BAMContext = {
      ContexteBAM: {
        attributes: {
          Version: '01_02',
        },
        Id: 'c1a2ff23-fc05-4bd1-b500-1ec7d3178f1c',
        Temps:'2021-07-05T13:58:27.452Z',
        Emetteur: '10B0152872',
        COUVERTURE: {},
      },
    };

    const LPSContext = {
      ContexteLPS: {
        attributes: {
          Nature: 'CTXLPS',
          Version: '01_00',
        },
        Id: '01f21998-e842-46e9-b4ea-99c15de82e65',
        Temps: '2021-07-05T13:58:27.452Z',
        Emetteur: '10B0152872',
        LPS: {
          IDAM: {
            attributes: { R: 4 },
            $value: 'NumAutorisation',
          },
          Version: '2022',
          Instance: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
          Nom: 'padoa',
        },
      },
    };

    const SoapAction = {
      Action: 'urn:ServiceIdentiteCertifiee:1.0.0:rechercherInsAvecTraitsIdentite',
    };

    const MessageID = {
      MessageID: '1f7425e2-b913-415c-adaa-785ee1076a70',
    };

    const wsdlUrl = 'src/fixtures/WSDL/DESIR_ICIR_EXP_1.5.0.wsdl';
    const clientSecurity = new ClientSSLSecurityPFX(pfx, {
      passphrase: PASSPHRASE,
      ca: combineCACertAsPem([
        'certificates/ca/ACR-EL.cer',
        'certificates/ca/ACI-EL-ORG.cer',
      ])
    });

    const soapClient = await createClientAsync(wsdlUrl, {
      forceSoap12Headers: true, // use soap v1.2

    });
    // use certificates
    soapClient.setSecurity(clientSecurity);

    // add wsa namespace because soap does not find it in the WSDL
    if (soapClient.wsdl.xmlnsInEnvelope.search('xmlns:wsa=\"http://www.w3.org/2005/08/addressing\"') == -1) {
      soapClient.wsdl.xmlnsInEnvelope += ' xmlns:wsa=\"http://www.w3.org/2005/08/addressing\"';
    }

    // add necessary headers
    soapClient.addSoapHeader(BAMContext, 'ContexteBAM', 'ctxbam');
    soapClient.addSoapHeader(LPSContext, 'ContexteLPS', 'ctxlps');
    soapClient.addSoapHeader(SoapAction, 'Action', 'wsa');
    soapClient.addSoapHeader(MessageID, 'MessageID', 'wsa');

    try {
      // call the SOAP endpoint with fakePayload
      const res = await soapClient['rechercherInsAvecTraitsIdentiteAsync'](fakePayload);
      // soapClient['rechercherInsAvecTraitsIdentite'](fakePayload, () => {}); can also be used with a callback
      console.log('[We should not end up here]', res);
    } catch (e) {
      const xmlAsString = (e as AxiosError).response?.data;
      console.log('RESPONSE CONTENT\n\n', xmlAsString);
      expect((e as AxiosError).response?.status).toBe(500);
      expect(xmlAsString).toContain(`Numéro d'autorisation du logiciel inconnu.`);
    }
  });
});
