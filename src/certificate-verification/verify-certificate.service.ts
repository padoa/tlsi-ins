import { Certificate } from "src/class/certificate.class";
import { Gender, INSiPerson } from "src/class/insi-person.class";
import { INSiClient } from "src/insi-client.service";
import { IDAM } from "src/models/env";
import yargs from "yargs";
import { hideBin } from 'yargs/helpers';

export class VerifyCertificateProcessor {
  public static async verifyCertificate (): Promise<void> {
    const { certificatePath, passPhrase, isTestCertif, idam: customizedIdam } = await yargs(hideBin(process.argv))
    .version(false)
    .help('h')
    .alias('h', 'help')
    .option('certificatePath', {
      describe: 'The path to the p12 certificate file to test',
      type: 'string',
    })
    .alias('cp', 'certificatePath')
    .option('passPhrase', {
      describe: 'The passphrase of the certificate to test',
      type: 'string',
    })
    .alias('pp', 'passPhrase')
    .option('isTestCertif', {
      describe: `It must be true if it's a test certificate`,
      type: 'boolean',
      default: false,
    })
    .alias('test', 'isTestCertif')
    .option('idam', {
      describe: `Use a different IDAM than the one in the environment`,
      type: 'string',
    })
    .demandOption(['certificatePath', 'passPhrase'])
    .strict()
    .parseAsync();
    const endpoint = isTestCertif ? 'https://qualiflps-services-ps-tlsm.ameli.fr:443/lps' : 'https://services-ps-tlsm.ameli.fr/lps';
  
    const certificate = Certificate.decryptCertificate(certificatePath, passPhrase);
    console.log('your certificate is:', certificate);

    console.log('------------------TEST TO CALL INS SERVER WITH THE CERTIFICATE AND A TEST USER------------------');
    const insiClient = INSiClient.getClientWithDefinedId(customizedIdam ? customizedIdam : IDAM);

    await insiClient.initClientPfx(certificate.pfx, passPhrase, endpoint);

    const requestId = 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f';
    const person = new INSiPerson({
      birthName: 'ADRUN',
      firstName: 'ZOE',
      gender: Gender.Female,
      dateOfBirth: '1975-12-31',
    });
    const fetchInsResult = await insiClient.fetchIns(person, { requestId, virtualModeEnabled: false });

    if (fetchInsResult.successRequest?.status!=='SUCCESS' && fetchInsResult.failedRequests[0]?.status!=='SUCCESS') {
      const errorMessage = fetchInsResult.successRequest ? fetchInsResult.successRequest : fetchInsResult.failedRequests[0];
      throw new Error(`Unable to make a valid INS call. Error message:\n${JSON.stringify(errorMessage)}`);
    }
    const responseMessage = fetchInsResult.successRequest ? fetchInsResult.successRequest : fetchInsResult.failedRequests[0];
    console.log(responseMessage.response.json);
    
    console.log('\n------------------ALL IS GOOD, YOU CAN USE THE CERTIFICATE------------------\n');
  }
}
