import fs from 'fs';
import https from 'https';
import { extractCertsFromP12 } from './certificates';

test('do not verifiy facing certificate', (done) => {
  const certificates = extractCertsFromP12('certificates/asip-p12-EL-TEST-ORG-AUTH_CLI-20211115-103506.p12');

  const agentOptions = {
    rejectUnauthorized: false,
    key: certificates.privateKeyAsPem,
    cert: certificates.certAsPem
  };
  const agent = new https.Agent(agentOptions);
  const reqOptions = {
    agent,
    // enableTrace: true,
    hostname: 'qualiflps-services-ps-tlsm.ameli.fr',
    path: '/lps',
    method: 'POST',
  };

  https.request(reqOptions, (res) => {
    console.log(res);
    expect(true).toBe(3);
    done()
  });

});
