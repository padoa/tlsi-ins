export interface PKCS12Certificate {
  base64: string;
  subjectCN: string;
  issuerCN: string;
  validity: {
    notBefore: Date;
    notAfter: Date;
  };
}


export type OpenPKCS12Response = {
  certificate: PKCS12Certificate;
  error: null;
} | {
  certificate: null;
  error: string;
}
