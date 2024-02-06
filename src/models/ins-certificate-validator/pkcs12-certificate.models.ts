export interface PKCS12Certificate {
  base64: string;
  subjectCN: string;
  issuerCN: string;
  validity: {
    notBefore: Date;
    notAfter: Date;
  };
}
