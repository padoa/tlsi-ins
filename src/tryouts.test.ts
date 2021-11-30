import fs from 'fs';
import https from 'https';
import { caCertificate, extractCertsFromP12, PASSPHRASE } from './certificates';

describe('Using the p12 directly', () => {
  const pfx = fs.readFileSync('certificates/asip-p12-EL-TEST-ORG-AUTH_CLI-20211115-103506.p12');

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

  test('validating the certificate with the provided CA ACI-EL-ORG-TEST.cer file', (done) => {
    const agentOptions: https.AgentOptions = {
      rejectUnauthorized: false,
      pfx,
      passphrase: PASSPHRASE,
      ca: caCertificate,
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
  })
});

describe('Using certs extracted with node-forge', () => {

  test('not verifiying facing certificate', (done) => {
    const certificates = extractCertsFromP12('certificates/asip-p12-EL-TEST-ORG-AUTH_CLI-20211115-103506.p12');

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
    const certificates = extractCertsFromP12('certificates/asip-p12-EL-TEST-ORG-AUTH_CLI-20211115-103506.p12');

    const agentOptions: https.AgentOptions = {
      key: certificates.privateKeyAsPem,
      // enableTrace: true,
      cert: certificates.certAsPem,
      ca: caCertificate
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
