import forge from 'node-forge';
import fs from 'fs';
import { config } from 'dotenv';

// Loads variables from the .env file
config()

export const { TLSI_INS_CERTIFICATE_PASSPHRASE } = process.env;

if (!TLSI_INS_CERTIFICATE_PASSPHRASE) throw new Error('Please provide a TLSI_INS_CERTIFICATE_PASSPHRASE env variable');

export const PASSPHRASE = TLSI_INS_CERTIFICATE_PASSPHRASE;

export const extractCertsFromP12 = (p12Path: string) => {

  const keyFile = fs.readFileSync(p12Path, 'binary');
  const p12Asn1 = forge.asn1.fromDer(keyFile);
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, TLSI_INS_CERTIFICATE_PASSPHRASE);

  const certBag = p12.getBags({ bagType: forge.pki.oids.certBag });

  if (!certBag) throw new Error('Could not find a cert bag');

  const certObject = certBag[forge.pki.oids.certBag];

  if (!certObject) throw new Error('No cert found in cert bag');

  const certificate = certObject[0].cert;

  if (!certificate) throw new Error('No certificate was found in the cert object');

  const shroudedKeyBag = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });

  if (!shroudedKeyBag) throw new Error('Could not find a shroudedKey bag');

  const shroudedKeyObject = shroudedKeyBag[forge.pki.oids.pkcs8ShroudedKeyBag];

  if (!shroudedKeyObject) throw new Error('No shroudedKey found in shroudedKey bag');

  const privateKey = shroudedKeyObject[0].key;

  if (!privateKey) throw new Error('No privateKey was found in the shroudedKey object');

  const publicKey = certificate.publicKey;

  const publicKeyAsPem = forge.pki.publicKeyToPem(publicKey);
  const privateKeyAsPem = forge.pki.privateKeyToPem(privateKey);
  const certAsPem = forge.pki.certificateToPem(certificate);

  return {
    publicKeyAsPem,
    privateKeyAsPem,
    certAsPem,
  };
}

export const caCertificate = fs.readFileSync('certificates/ca/ACI-EL-ORG-TEST.cer');
