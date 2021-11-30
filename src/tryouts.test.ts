import fs from 'fs';
import https from 'https';
import { caCertificate, extractCertsFromP12 } from './certificates';

test('do not verifiy facing certificate', (done) => {
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

test('use provided CA to verifiy facing certificate', (done) => {
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
