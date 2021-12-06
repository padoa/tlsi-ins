import fs from 'fs';
import https from 'https';
import forge from 'node-forge';
import axios from 'axios';
import { caCertificates, combineCACertAsPem, extractCertsFromP12, PASSPHRASE, readCACertAsPem } from './certificates';

const ACI_EL_ORG_PEM_CERTIFICATE = [
  '-----BEGIN CERTIFICATE-----',
  'MIIHPDCCBSSgAwIBAgISESBlOmv0rqXMPTj6BWIj9azxMA0GCSqGSIb3DQEBCwUA',
  'MHkxCzAJBgNVBAYTAkZSMRMwEQYDVQQKDApBU0lQLVNBTlRFMRcwFQYDVQQLDA4w',
  'MDAyIDE4NzUxMjc1MTESMBAGA1UECwwJSUdDLVNBTlRFMSgwJgYDVQQDDB9BQyBS',
  'QUNJTkUgSUdDLVNBTlRFIEVMRU1FTlRBSVJFMB4XDTEzMDYyNTAwMDAwMFoXDTMz',
  'MDYyNDAwMDAwMFowgYAxCzAJBgNVBAYTAkZSMRMwEQYDVQQKDApBU0lQLVNBTlRF',
  'MRcwFQYDVQQLDA4wMDAyIDE4NzUxMjc1MTESMBAGA1UECwwJSUdDLVNBTlRFMS8w',
  'LQYDVQQDDCZBQyBJR0MtU0FOVEUgRUxFTUVOVEFJUkUgT1JHQU5JU0FUSU9OUzCC',
  'AiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAKuma07Nw0krbXtveIwQLDPG',
  'M7KnaEJRW4rsxqXRc45gTCjZCfyxMo7mb88jtE6OrBORkMOhIWVxiR7Xplf6gqMh',
  'LL+OCb1R0wjBcOEwyrEB2rVTKebUvKFsEEOZsLttzIMYYNV+2aPgEj9s+TiOkS+L',
  'SgYgz/Pj6z/i1gi3skGD7wEUq9/j4h54xmTjt1gO8fenejsCUH5ZJjrzQa/TtYKG',
  'IV87y9AdQZOofEz4Y8AwNU0oMpmmW4pucAu1A/jmgZ7ZAUr87+jBwJqSWzkkkWUh',
  '3yR0VTqJigJafg0V+/O+kw7OaZWApK9cgyKG7n4VVs3c2JLHgBA4L2r4HJyAnGn9',
  'Wi1d+0PTXOJuO7Lc7QsR3XjHLj90YkKs9p08F5/GFQlYqpoQaI2gj6AycWsBgJWv',
  '2FLiLUnUaiZkiX/wgssVDbBfuOktDEf+hcVgTjmNEXxAhLARpF2XxVRrJTWwFNvg',
  '9i+qxAboPt2c7BzdhuyoOWhm3JtmTa87Xjo8DpnUV3yAGSguO1g62dMWcAJEEswL',
  '37XzWo0K/lwjeGTYrbgKR8UnyYVg7RD2rHdkWpofxhIA8fil3kozlgSOeqBWuzwd',
  'Dk9rKesGPFYPVY1W1dvvtGt/50ggSzfV/e2wlMSFXU0uY1QOP6H5GNMtvk8pnnwr',
  '6JCwmMjrqlBU6uZ7JJXNAgMBAAGjggG0MIIBsDASBgNVHRMBAf8ECDAGAQH/AgEA',
  'MA4GA1UdDwEB/wQEAwIBBjBDBgNVHSAEPDA6MDgGBFUdIAAwMDAuBggrBgEFBQcC',
  'ARYiaHR0cDovL2lnYy1zYW50ZS5lc2FudGUuZ291di5mci9QQzCCAQMGA1UdHwSB',
  '+zCB+DA0oDKgMIYuaHR0cDovL2lnYy1zYW50ZS5lc2FudGUuZ291di5mci9DUkwv',
  'QUNSLUVMLmNybDCBv6CBvKCBuYaBtmxkYXA6Ly9hbm51YWlyZS1pZ2MuZXNhbnRl',
  'LmdvdXYuZnIvQ049QUMlMjBSQUNJTkUlMjBJR0MtU0FOVEUlMjBFTEVNRU5UQUlS',
  'RSxPVT1JR0MtU0FOVEUsT1U9MDAwMiUyMDE4NzUxMjc1MSxPPUFTSVAtU0FOVEUs',
  'Qz1GUj9jZXJ0aWZpY2F0ZXJldm9jYXRpb25saXN0O2JpbmFyeT9iYXNlP29iamVj',
  'dGNsYXNzPXBraUNhMB0GA1UdDgQWBBTX+/rc1QJ/58FThk1L6KRKHgu7YzAfBgNV',
  'HSMEGDAWgBSMb+rVi4L6+b6H3HMOJxUHR8SeLzANBgkqhkiG9w0BAQsFAAOCAgEA',
  'IDLRXaIA/qcy9LlQBDc2lqul0V9Zga2XWmC0R71JcWUKZn++sk42UJD18TxctJxQ',
  't+03HOeBhpH6GdWUtOPW+kVDt+C9dWjFq0E4W/B0QD35iUNIu3nCE3Ke6NNitJ5+',
  'q5a4wODaH9w2bA/8TO3kbxx98W9BCX+oXI7WN8/LpHxce6JdAd18PKZST9glk/ms',
  'o0jtWOKw/jLL2S6AnZfYIJ+ZhpAJ5AxdkexWhTTnOekLwTcr3EVSQ9J7e7mzJ6iD',
  '4AvtEdTCM6sJcL7QBvmIC4K/V9a7E47LoXsIDAWQgfWlt3SiOQG/19djzZod7z9B',
  'ya37bji1VKzdOMYH1M1HlXW8Z4S0DwqjqQsSYeKejUwgLv+laKpsm5wvJOa6PLHn',
  'LMzSD4KvyuOpiKXCS5pmAVdwOmVB+41C9lrp5uq2IV7hpOH6m/674+D4WXPB+ITd',
  '2mqrRfwdzr5xjFfSOuMRZJwPJ+3LBtThCeDoZ/dyFwH6ichBi2+qPs38t8bw+j+W',
  '0jzA9ulGsuSP5aTPwRKiodLXeVAPR9UtMGoUv3hXCWMqBGxxhb2e+k3qL+c5/S3F',
  'a7pcoiK+h9hT0e5RPhWttgtVoOKJ0TWWK7JahaPRlI4IX/YxURsz3tsJnEi/i0gG',
  'a0OcI0DJWSyIc6wGQYaIZCatZQZhTj+OsMrWP0vZJmI=',
  '-----END CERTIFICATE-----\r\n',
].join('');

const ACR_EL_PEM_CERTIFICATE = [
  '-----BEGIN CERTIFICATE-----',
  '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',
  '-----END CERTIFICATE-----\r\n',
].join('\r\n');

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
    ].join('\r\n');
    expect(certChain).toEqual(expected);
  });

})
describe('Using the p12 directly', () => {
  const pfx = fs.readFileSync('certificates/INSI-AUTO/AUTO-certificate.p12');

  test('not validating facing certificate', (done) => {
    const agentOptions: https.AgentOptions = {
      rejectUnauthorized: false,
      pfx,
      passphrase: PASSPHRASE,
      // enableTrace: true,
    };
    const agent = new https.Agent(agentOptions);
    const reqOptions: https.RequestOptions = {
      agent,
      hostname: 'qualiflps-services-ps-tlsm.ameli.fr',
      path: '/lps',
      method: 'POST',
    };

    https.request(reqOptions, (res) => {

      console.log(res);

      expect(res.statusCode).toBe(200);
      done()
    });
  });

  /**
   * - Pour vérifier le serveur du serveur, vous devez utiliser les AC « AC IGC-SANTE ELEMENTAIRE ORGANISATIONS » et AC RACINE IGC-SANTE ELEMENTAIRE
   * - Ces 2 fichier d'AC sont disponibles à cette adresse : http://igc-sante.esante.gouv.fr/PC/
   */
  test('validating the certificate with the downloaded CA certificates', (done) => {
    const agentOptions: https.AgentOptions = {
      pfx,
      passphrase: PASSPHRASE,
      ca: combineCACertAsPem([
        'certificates/ca/ACR-EL.cer',
        'certificates/ca/ACI-EL-ORG.cer',
      ]),
      // enableTrace: true,
    };
    const agent = new https.Agent(agentOptions);
    const reqOptions: https.RequestOptions = {
      agent,
      hostname: 'qualiflps-services-ps-tlsm.ameli.fr',
      path: '/lps',
      method: 'POST',
    };

    https.request(reqOptions, (res) => {

      console.log(res);

      expect(res.statusCode).toBe(200);
      done()
    });
  });

  test('validating the certificate with the downloaded CA certificates with no agent', (done) => {
    const reqOptions: https.RequestOptions = {
      agent: false,
      hostname: 'qualiflps-services-ps-tlsm.ameli.fr',
      path: '/lps',
      port: 443,
      protocol: 'https:',
      method: 'POST',
      pfx,
      passphrase: PASSPHRASE,
      ca: combineCACertAsPem([
        'certificates/ca/ACR-EL.cer',
        'certificates/ca/ACI-EL-ORG.cer',
      ]),
    };

    https.request(reqOptions, (res) => {

      console.log(res);

      expect(res.statusCode).toBe(200);
      done()
    });
  });

  test.only('validating the certificate with the downloaded CA certificates with axios', (done) => {
    jest.setTimeout(10000);
    const agentOptions: https.AgentOptions = {
      pfx,
      passphrase: PASSPHRASE,
      ca: combineCACertAsPem([
        'certificates/ca/ACR-EL.cer',
        'certificates/ca/ACI-EL-ORG.cer',
      ]),
      // enableTrace: true,
    };
    const agent = new https.Agent(agentOptions);

    axios.post('https://qualiflps-services-ps-tlsm.ameli.fr:443/lps', {}, { httpsAgent: agent })
      .then((res) => {
        console.log(res);

        done();
      })
      .catch(e => {
        console.log(e);
      });

  });

  test('validating the certificate with the chain of CA certificates', (done) => {
    const agentOptions: https.AgentOptions = {
      pfx,
      passphrase: PASSPHRASE,
      ca: fs.readFileSync('certificates/ca/Chaine_de_certification-IGC-Sante.p7b'),
      // enableTrace: true,
    };
    const agent = new https.Agent(agentOptions);
    const reqOptions: https.RequestOptions = {
      agent,
      hostname: 'qualiflps-services-ps-tlsm.ameli.fr',
      path: '/lps',
      method: 'POST',
    };

    https.request(reqOptions, (res) => {

      console.log(res);

      expect(res.statusCode).toBe(200);
      done()
    });
  });

  test('validating the certificate with the downloaded CA TEST certificates', (done) => {
    const agentOptions: https.AgentOptions = {
      pfx,
      passphrase: PASSPHRASE,
      ca: combineCACertAsPem([
        'certificates/ca/ACR-EL.cer',
        'certificates/ca/ACI-EL-ORG.cer',
      ]),
      // enableTrace: true,
    };
    const agent = new https.Agent(agentOptions);
    const reqOptions: https.RequestOptions = {
      agent,
      hostname: 'qualiflps-services-ps-tlsm.ameli.fr',
      path: '/lps',
      method: 'POST',
    };

    https.request(reqOptions, (res) => {

      console.log(res);

      expect(res.statusCode).toBe(200);
      done()
    });
  });
});

describe.skip('Using certs extracted with node-forge', () => {
  test('not verifiying facing certificate', (done) => {
    const certificates = extractCertsFromP12('certificates/INSI-AUTO/AUTO-certificate.p12');

    const agentOptions: https.AgentOptions = {
      rejectUnauthorized: false,
      key: certificates.privateKeyAsPem,
      // enableTrace: true,
      cert: certificates.certAsPem,
    };
    const agent = new https.Agent(agentOptions);
    const reqOptions: https.RequestOptions = {
      agent,
      hostname: 'qualiflps-services-ps-tlsm.ameli.fr',
      path: '/lps',
      method: 'POST',
    };

    https.request(reqOptions, (res) => {

      console.log(res);

      expect(res.statusCode).toBe(200);
      done()
    });
  });

  test('validating the certificate with the provided CA ACI-EL-ORG-TEST.cer file', (done) => {
    const certificates = extractCertsFromP12('certificates/INSI-AUTO/AUTO-certificate.p12');

    const agentOptions: https.AgentOptions = {
      key: certificates.privateKeyAsPem,
      // enableTrace: true,
      cert: certificates.certAsPem,
      ca: caCertificates
    };
    const agent = new https.Agent(agentOptions);
    const reqOptions: https.RequestOptions = {
      agent,
      hostname: 'qualiflps-services-ps-tlsm.ameli.fr',
      path: '/lps',
      method: 'POST',
    };

    https.request(reqOptions, (res) => {

      console.log(res);

      expect(res.statusCode).toBe(200);
      done()
    });
  });
});
