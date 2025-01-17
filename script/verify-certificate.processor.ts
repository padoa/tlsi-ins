import { BamContext } from '../src/ins/class/bam-context.class';
import { Gender, INSiPerson } from '../src/ins/class/insi-person.class';
import { LpsContext } from '../src/ins/class/lps-context.class';
import { LPS } from '../src/ins/class/lps.class';
import { InsCertificateValidator } from '../src/ins/class/ins-certificate-validator.class';
import { InsCertificateValidity } from '../src/ins/models/ins-certificate-validator/ins-certificate-validator.models';
import { INSiClient } from '../src/ins/insi-client.service';
import { IDAM, SOFTWARE_NAME, SOFTWARE_VERSION } from '../src/ins/models/env.ins';
import {
  AssertionStatus,
  InsAssertionResult,
  InsAssertionType,
} from '../src/ins/models/ins-certificate-validator/ins-assertion.models';

const getClientWithDefinedId = (idam: string): INSiClient => {
  const lps = new LPS({
    idam,
    version: SOFTWARE_VERSION,
    name: SOFTWARE_NAME,
    id: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
  });

  const lpsContext = new LpsContext({
    emitter: 'previsit+certificate-testing-script@padoa.fr',
    lps,
  });

  const bamContext = new BamContext({
    emitter: 'previsit+certificate-testing-script@padoa.fr',
  });

  return new INSiClient({
    lpsContext,
    bamContext,
    overrideSpecialCases: true,
  });
};

export class VerifyCertificateProcessor {
  public static async verifyCertificate(
    pfx: Buffer,
    passPhrase: string,
    endpoint: string,
    customizedIdam?: string
  ): Promise<void> {
    const { insCertificateValidity, insAssertions, error } =
      InsCertificateValidator.validatePKCS12(pfx, passPhrase);

    if (error) {
      console.log('Certificate validity : ❌');
      console.log('---');
      console.log(`Error message: ${error.message}`);
      return;
    }

    console.log(
      `Certificate validity : ${
        insCertificateValidity === InsCertificateValidity.VALID ? '✅' : '❌'
      }`
    );
    console.log('---');
    Object.values(
      insAssertions as Record<InsAssertionType, InsAssertionResult>
    ).forEach((assertion) => {
      console.log(
        `${assertion.status === AssertionStatus.SUCCESS ? '✅' : '❌'} ${
          assertion.message
        }`
      );
    });
    if (insCertificateValidity === InsCertificateValidity.INVALID) {
      return;
    }

    console.log('\nTEST TO CALL INS SERVER WITH THE CERTIFICATE AND ADRUN ZOE');
    const insiClient = getClientWithDefinedId(customizedIdam || IDAM);
    await insiClient.initClientPfx(pfx, passPhrase, endpoint);
    const person = new INSiPerson({
      birthName: 'ADRUN',
      firstName: 'ZOE',
      gender: Gender.Female,
      dateOfBirth: '1975-12-31',
    });
    const fetchInsResult = await insiClient.fetchIns(person, {
      virtualModeEnabled: false,
    });

    if (
      fetchInsResult.successRequest?.status !== 'SUCCESS' &&
      fetchInsResult.failedRequests[0]?.status !== 'SUCCESS'
    ) {
      const errorMessage = fetchInsResult.successRequest
        ? fetchInsResult.successRequest
        : fetchInsResult.failedRequests[0];
      throw new Error(
        `Unable to make a valid INS call. Error message:\n${JSON.stringify(
          errorMessage
        )}`
      );
    }
    const responseMessage = fetchInsResult.successRequest
      ? fetchInsResult.successRequest
      : fetchInsResult.failedRequests[0];
    console.log(responseMessage.response.json);
    console.log('\nALL IS GOOD, YOU CAN USE THE CERTIFICATE\n');
  }
}
