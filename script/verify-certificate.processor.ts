import { Gender, INSiPerson } from '../src/class/insi-person.class';
import { IPKCS12Certificate, PKCS12Certificate } from '../src/class/pkcs12certificate.class';
import { INSiClient } from '../src/insi-client.service';
import { IDAM } from '../src/models/env';

export class VerifyCertificateProcessor {
  public static async verifyCertificate (certificate: IPKCS12Certificate, passPhrase: string, endpoint: string, customizedIdam?: string): Promise<void> {
    console.log(PKCS12Certificate.validateINSCertificate(certificate));
    console.log('------------------TEST TO CALL INS SERVER WITH THE CERTIFICATE AND A TEST USER------------------');
    const insiClient = INSiClient.getClientWithDefinedId(customizedIdam ? customizedIdam : IDAM, true, undefined, undefined, 'previsit+certificate-testing-script@padoa.fr');

    await insiClient.initClientPfx(Buffer.from(certificate.pfx, 'base64'), passPhrase, endpoint);

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
