import { config } from 'dotenv';

// Loads variables from the .env file

// WARNING
// THIS FILE MUST NOT BE IMPORTED OUTSIDE TEST ENVIRONMENT

config();

export const { TLSI_INS_CERTIFICATE_PASSPHRASE } = process.env;
if (!TLSI_INS_CERTIFICATE_PASSPHRASE)
  throw new Error(
    'Please provide a TLSI_INS_CERTIFICATE_PASSPHRASE env variable'
  );
export const PASSPHRASE: string = TLSI_INS_CERTIFICATE_PASSPHRASE as string;

const { MEDIMAIL_CERTIFICATE_PASSPHRASE } = process.env;
if (!MEDIMAIL_CERTIFICATE_PASSPHRASE)
  throw new Error(
    'Please provide a MEDIMAIL_CERTIFICATE_PASSPHRASE env variable'
  );
export const MML_CERTIFICATE_PASSPHRASE: string =
  MEDIMAIL_CERTIFICATE_PASSPHRASE as string;

const { MEDIMAIL_ACCOUNT_EMAIL } = process.env;
if (!MEDIMAIL_ACCOUNT_EMAIL)
  throw new Error(
    'Please provide a MEDIMAIL_ACCOUNT_EMAIL env variable'
  );
export const MML_ACCOUNT_EMAIL: string = MEDIMAIL_ACCOUNT_EMAIL as string;

const { MEDIMAIL_TEST_RECIPIENT_EMAIL } = process.env;
if (!MEDIMAIL_TEST_RECIPIENT_EMAIL)
  throw new Error(
    'Please provide a MEDIMAIL_TEST_RECIPIENT_EMAIL env variable'
  );
export const MML_TEST_RECIPIENT_EMAIL: string = MEDIMAIL_TEST_RECIPIENT_EMAIL as string;
