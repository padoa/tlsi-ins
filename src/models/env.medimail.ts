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
