import { config } from 'dotenv';

// Loads variables from the .env file
config()

export const { TLSI_INS_CERTIFICATE_PASSPHRASE } = process.env;
if (!TLSI_INS_CERTIFICATE_PASSPHRASE) throw new Error('Please provide a TLSI_INS_CERTIFICATE_PASSPHRASE env variable');
export const PASSPHRASE = TLSI_INS_CERTIFICATE_PASSPHRASE;
export const { TLSI_INS_IDAM } = process.env;
export const IDAM = TLSI_INS_IDAM;
