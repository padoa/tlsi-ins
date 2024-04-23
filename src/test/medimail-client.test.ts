import { MML_CERTIFICATE_PASSPHRASE, PASSPHRASE } from '../models/env.medimail';
import { MedimailClient } from '../medimail-client.service';
import fs from 'fs';

describe('Medimail Client', () => {
  const failingPfx = fs.readFileSync(
    'certificates/INSI-AUTO/AUTO-certificate.p12'
  );
  const failingMmlPfx = fs.readFileSync(
    'certificates/mss/padoa-group-environnement-dev.22-04-2024-12-16-14.p12'
  );
  const mmlPfx = fs.readFileSync(
    'certificates/mss/updated-padoa-group-environnement-dev.22-04-2024-12-16-14.p12'
  );
  test('should fail call to the hello API', async () => {
    const medimailClient = new MedimailClient();
    const expecterErrorMessage =
      'Client SOAP certificat inconnu (CN=INSI-AUTO,OU=10B0152872,O=CENTRE DE SANTE RPPS15287,ST=Rhône (69),C=FR)';
    await medimailClient.init(failingPfx, PASSPHRASE);

    expect(async () => {
      await medimailClient.hello('banana');
    }).rejects.toThrowError(expecterErrorMessage);
  });
  test('should fail to make a first call to the hello API with the old certificate', async () => {
    const medimailClient = new MedimailClient();
    const expecterErrorMessage = 'unsupported';

    await medimailClient.init(failingMmlPfx, MML_CERTIFICATE_PASSPHRASE);

    expect(async () => {
      await medimailClient.hello('banana');
    }).rejects.toThrowError(expecterErrorMessage);
  });
  test('should make a first call to the hello API', async () => {
    const medimailClient = new MedimailClient();
    const expectedReturn = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<hello>',
      '  <status>ok</status>',
      '  <hello>1</hello>',
      '</hello>',
    ].join('\n');
    await medimailClient.init(mmlPfx, MML_CERTIFICATE_PASSPHRASE);

    const reply = await medimailClient.hello('ca.s@padoa-group.com');
    expect(reply.status).toBe('SUCCESS');
    expect(reply.response.formatted.return.$value).toBe(expectedReturn);
  });
});
