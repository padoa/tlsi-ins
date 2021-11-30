import fs from 'fs';
import https from 'https';

const options = {
  // rejectUnauthorized: false,
  enableTrace: true,
  hostname: 'qualiflps-services-ps-tlsm.ameli.fr',
  path: '/lps',
  method: 'POST',
  key: fs.readFileSync('./file.key.pem'),
  cert: fs.readFileSync('./file.crt.pem')
};
options.agent = new https.Agent(options);

https.request(options, (res) => {
  console.log(res);
});
