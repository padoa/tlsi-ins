import forge from 'node-forge';
import fs from 'fs';
import { config } from 'dotenv';

// Loads variables from the .env file
config()

export const { TLSI_INS_CERTIFICATE_PASSPHRASE } = process.env;

if (!TLSI_INS_CERTIFICATE_PASSPHRASE) throw new Error('Please provide a TLSI_INS_CERTIFICATE_PASSPHRASE env variable');

export const PASSPHRASE = TLSI_INS_CERTIFICATE_PASSPHRASE;

export const combineCACertAsPem = (caCertPaths: string[]): string => {
  return caCertPaths.map(readCACertAsPem).join('');
}

export const readCACertAsPem = (path: string): string => {
  const certFile = fs.readFileSync(path, 'binary');

  const asn1Cert = forge.asn1.fromDer(certFile);
  const certificate = forge.pki.certificateFromAsn1(asn1Cert);
  const pem = forge.pki.certificateToPem(certificate);
  return pem;
}
