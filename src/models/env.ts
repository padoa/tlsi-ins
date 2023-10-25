import { config } from 'dotenv';

// Loads variables from the .env file

// WARNING
// THIS FILE MUST NOT BE IMPORTED OUTSIDE TEST ENVIRONMENT

config()

export const { TLSI_INS_CERTIFICATE_PASSPHRASE } = process.env;
if (!TLSI_INS_CERTIFICATE_PASSPHRASE) throw new Error('Please provide a TLSI_INS_CERTIFICATE_PASSPHRASE env variable');
export const PASSPHRASE: string = TLSI_INS_CERTIFICATE_PASSPHRASE as string;

export const { TLSI_INS_IDAM } = process.env;
if (!TLSI_INS_IDAM) throw new Error('Please provide a TLSI_INS_IDAM env variable');
export const IDAM: string = TLSI_INS_IDAM as string;

export const { TLSI_INS_SOFTWARE_NAME } = process.env;
if (!TLSI_INS_SOFTWARE_NAME) throw new Error('Please provide a TLSI_INS_SOFTWARE_NAME env variable');
export const SOFTWARE_NAME: string = TLSI_INS_SOFTWARE_NAME as string;

export const { TLSI_INS_SOFTWARE_VERSION } = process.env;
if (!TLSI_INS_SOFTWARE_VERSION) throw new Error('Please provide a TLSI_INS_SOFTWARE_VERSION env variable');
export const SOFTWARE_VERSION: string = TLSI_INS_SOFTWARE_VERSION as string;
