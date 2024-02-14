import { VerifyCertificateProcessor } from './verify-certificate.processor';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';

const run = async (): Promise<void> => {
  const { certificatePath, passPhrase, isTestCertif, idam: customizedIdam } = await yargs(hideBin(process.argv))
    .version(false)
    .help('h')
    .alias('h', 'help')
    .option('certificatePath', {
      describe: 'The path to the p12 certificate file to test',
      type: 'string',
    })
    .option('passPhrase', {
      describe: 'The passphrase of the certificate to test',
      type: 'string',
    })
    .option('isTestCertif', {
      describe: 'It must be true if it\'s a test certificate',
      type: 'boolean',
      default: false,
    })
    .option('idam', {
      describe: 'Use a different IDAM than the one in the environment',
      type: 'string',
    })
    .demandOption(['certificatePath', 'passPhrase'])
    .strict()
    .parseAsync();

  const endpoint = isTestCertif ? 'https://qualiflps-services-ps-tlsm.ameli.fr:443/lps' : 'https://services-ps-tlsm.ameli.fr/lps';
  const pfx = fs.readFileSync(certificatePath)
  await VerifyCertificateProcessor.verifyCertificate(pfx, passPhrase, endpoint, customizedIdam);
}

run().catch((e) => {
  console.log(`Error while running the verify certificate script : ${e}`);
});
