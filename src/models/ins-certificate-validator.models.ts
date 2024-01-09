export enum INSCertificateValidity {
  VALID = 'VALID',
  INVALID = 'INVALID',
}

export enum ICertificateType {
  INSI_AUTO = 'INSI-AUTO',
  INSI_MANU = 'INSI-MANU',
}
export enum AssertionType {
  SUBJECT_CN = 'SUBJECT CN',
  ISSUER_CN = 'ISSUER CN',
  VAILIDITY_DATES = 'VALIDITY DATES',
  PKCS12_CERTIFICATE = 'PKCS12 CERTIFICATE'
}

export enum AssertionStatus {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}

export interface INSValidityAssertion {
  type: AssertionType,
  status: AssertionStatus,
  certificateType?: string,
  endDate?: Date,
  message: string,
}

export interface IINSValidationResponse {
  certificateValidity: INSCertificateValidity,
  assertions: INSValidityAssertion[],
  error?: { message: string },
}

export interface IValidityDates {
  notBefore: Date;
  notAfter: Date;
}

export interface IPKCS12Certificate {
  pfx: string; //base 64
  subjectCN: string;
  issuerCN: string;
  validity: IValidityDates;
}