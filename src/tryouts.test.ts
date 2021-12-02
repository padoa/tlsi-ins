import fs from 'fs';
import https from 'https';
import { caCertificates, extractCertsFromP12, PASSPHRASE } from './certificates';

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
      ca: [
        fs.readFileSync('certificates/ca/ACI-EL-ORG.cer'),
        fs.readFileSync('certificates/ca/ACR-EL.cer'),
      ],
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
      ca: [
        fs.readFileSync('certificates/ca/ACI-EL-ORG.cer'),
        fs.readFileSync('certificates/ca/ACR-EL.cer'),
      ],
    };

    https.request(reqOptions, (res) => {

      console.log(res);

      expect(res.statusCode).toBe(200);
      done()
    });
  });

  test('validating the certificate with the chain of CA certificates', (done) => {
    const agentOptions: https.AgentOptions = {
      pfx,
      passphrase: PASSPHRASE,
      ca: [
        fs.readFileSync('certificates/ca/Chaine_de_certification-IGC-Sante.p7b'),
      ],
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
      ca: [
        fs.readFileSync('certificates/ca/ACI-EL-ORG-TEST.cer'),
        fs.readFileSync('certificates/ca/ACR-EL-TEST.cer'),
      ],
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
