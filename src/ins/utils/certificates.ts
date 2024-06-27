import forge from 'node-forge';
import fs from 'fs';

export const combineCertAsPem = (caCertPaths: string[]): string => {
  return caCertPaths.map(readCertAsPem).join('');
}

export const readCertAsPem = (path: string): string => {
  const certFile = fs.readFileSync(path, 'binary');

  const asn1Cert = forge.asn1.fromDer(certFile);
  const certificate = forge.pki.certificateFromAsn1(asn1Cert);
  const pem = forge.pki.certificateToPem(certificate);
  return pem;
}
