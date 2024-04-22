import { PASSPHRASE } from '../models/env';
import { MedimailClient } from '../medimail-client.service';
import fs from 'fs';
import { ISoapError } from 'soap/lib/client';

describe('Medimail Client', () => {
  const pfx = fs.readFileSync(
    'certificates/INSI-AUTO/AUTO-certificate-fake.p12'
  );

  test('should be make a first call to the hello API', async () => {
    const medimailClient = new MedimailClient();

    await medimailClient.init(pfx, PASSPHRASE);

    try {
      const result = await medimailClient.hello('banana');
      console.log(result.response.formatted);
    } catch (error: unknown) {
      const err = error as ISoapError;
      if (err.response) {
        console.error('response', err.response.formatted);
      }
      console.error('error', error);
      throw error;
    }
  });
});
