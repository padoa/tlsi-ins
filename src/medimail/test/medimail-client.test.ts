import * as path from 'path';
import fs from 'fs';
import { MML_CERTIFICATE_PASSPHRASE, PASSPHRASE, MML_ACCOUNT_EMAIL, MML_TEST_RECIPIENT_EMAIL } from '../models/env.medimail';
import { CheckboxType } from '../models/medimail.types';
import { MedimailClient } from '../medimail-client.service';

describe('Medimail Client', () => {
  let sentEmailRef: string;
  const mailTitle = 'Salut à toi';
  const mailMessage = "Ce message provient de l'API";
  const failingPfx = fs.readFileSync(
    'certificates/INSI-AUTO/AUTO-certificate.p12'
  );
  const failingMmlPfx = fs.readFileSync(
    'certificates/mss/padoa-group-environnement-dev.22-04-2024-12-16-14.p12'
  );
  const mmlPfx = fs.readFileSync(
    'certificates/mss/updated-padoa-group-environnement-dev.22-04-2024-12-16-14.p12'
  );
  test('should fail call to the hello API when using an unknown certificate', async () => {
    const medimailClient = new MedimailClient();
    const expecterErrorMessage =
      'Client SOAP certificat inconnu (CN=INSI-MANU,OU=10B0221636,O=CENTRE DE SANTE RPPS22163,ST=Rhône (69),C=FR)';
    await medimailClient.init(failingPfx, PASSPHRASE, MML_ACCOUNT_EMAIL);

    expect(async () => {
      await medimailClient.hello('banana');
    }).rejects.toThrow(expecterErrorMessage);
  });

  test('should fail to make a first call to the hello API with the old certificate', async () => {
    const medimailClient = new MedimailClient();
    const expecterErrorMessage = 'unsupported';
    const expecterErrorMessage2 = 'Unsupported PKCS12 PFX data';

    await medimailClient.init(failingMmlPfx, MML_CERTIFICATE_PASSPHRASE, MML_ACCOUNT_EMAIL);

    expect(async () => {
      await medimailClient.hello(MML_ACCOUNT_EMAIL);
    }).rejects.toThrow(new RegExp(`${expecterErrorMessage}|${expecterErrorMessage2}`));
  });

  test('should make a call to the hello API when using the correct certificate', async () => {
    const medimailClient = new MedimailClient();
    const expectedReturn = {
      hello: {
        status: 'ok',
        hello: '1',
      }
    }
    await medimailClient.init(mmlPfx, MML_CERTIFICATE_PASSPHRASE, MML_ACCOUNT_EMAIL);

    const reply = await medimailClient.hello(MML_ACCOUNT_EMAIL);
    expect(reply).toMatchObject(expectedReturn);
  });

  test('should be able to send mail through the  API', async () => {
    const medimailClient = new MedimailClient();
    await medimailClient.init(mmlPfx, MML_CERTIFICATE_PASSPHRASE, MML_ACCOUNT_EMAIL);

    const reply = await medimailClient.send({
      title: mailTitle, message: mailMessage, signatories: [MML_TEST_RECIPIENT_EMAIL],
      attachments: {
        attachment1: {
          name: 'test.pdf',
          content: fs.readFileSync(path.resolve(__dirname, './attachments/testfile.pdf')).toString('base64')
        }
      }
    });
    sentEmailRef = reply.webisend.refs.mss as string;

    const expectedResponse = {
      webisend: {
        status: 'sent',
        author: MML_ACCOUNT_EMAIL,
        signatories: MML_TEST_RECIPIENT_EMAIL
      }
    };

    expect(reply).toMatchObject(expectedResponse);
  });

  test('should be able to open mail through the  API', async () => {
    const medimailClient = new MedimailClient();
    await medimailClient.init(mmlPfx, MML_CERTIFICATE_PASSPHRASE, MML_ACCOUNT_EMAIL);

    const reply = await medimailClient.open(sentEmailRef);

    const expectedResponse = {
      webiopen: {
        status: 'open',
        content: expect.stringContaining(mailMessage),
        title: mailTitle,
        call: MML_ACCOUNT_EMAIL,
        signatories: {
          signatory: {
            email: MML_TEST_RECIPIENT_EMAIL,
          }
        }
      },
    };

    expect(reply).toMatchObject(expectedResponse);
  });

  // TODO: fix this test
  test.skip('should be able to check received emails through the  API', async () => {
    const medimailClient = new MedimailClient();
    await medimailClient.init(mmlPfx, MML_CERTIFICATE_PASSPHRASE, MML_ACCOUNT_EMAIL);
    const todaysDate: Date = new Date(new Date().setHours(0, 0, 0, 0))
    const reply = await medimailClient.checkbox(CheckboxType.ALL_MESSAGES, todaysDate);

    const expectedResponse = {
      webicheckbox: {
        status: 'ok',
        user: MML_ACCOUNT_EMAIL,
      },
    };

    expect(reply).toMatchObject(expectedResponse);
    expect(Array.isArray(reply.webicheckbox.outputs.kvp)).toBe(true);
  });
});
