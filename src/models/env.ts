import { config } from 'dotenv';

// Loads variables from the .env file
config()

export const { TLSI_INS_CERTIFICATE_PASSPHRASE } = process.env;
if (!TLSI_INS_CERTIFICATE_PASSPHRASE) throw new Error('Please provide a TLSI_INS_CERTIFICATE_PASSPHRASE env variable');
export const PASSPHRASE = TLSI_INS_CERTIFICATE_PASSPHRASE;

export const { TLSI_INS_IDAM } = process.env;
if (!TLSI_INS_CERTIFICATE_PASSPHRASE) throw new Error('Please provide a TLSI_INS_IDAM env variable');
export const IDAM = TLSI_INS_IDAM;

export const { TLSI_INS_SOFTWARE_NAME } = process.env;
if (!TLSI_INS_CERTIFICATE_PASSPHRASE) throw new Error('Please provide a TLSI_INS_SOFTWARE_NAME env variable');
export const SOFTWARE_NAME = TLSI_INS_SOFTWARE_NAME;

export const { TLSI_INS_SOFTWARE_VERSION } = process.env;
if (!TLSI_INS_CERTIFICATE_PASSPHRASE) throw new Error('Please provide a TLSI_INS_SOFTWARE_VERSION env variable');
export const SOFTWARE_VERSION = TLSI_INS_SOFTWARE_VERSION;
