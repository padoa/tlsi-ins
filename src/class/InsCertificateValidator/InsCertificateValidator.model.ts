export enum INSCertificateValidity {
  VALID = 'VALID',
  INVALID = 'INVALID',
}

export enum AssertionType {
  SUBJECT_CN = 'SUBJECT CN',
  ISSUER_CN = 'ISSUER CN',
  VAILIDITY_DATES = 'VALIDITY DATES',
}

export enum AssertionStatus {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}

export interface INSValidityAssertion {
  type: AssertionType,
  status: AssertionStatus,
  message: string,
}

export interface IINSValidationResponse {
  certificateValidity: INSCertificateValidity,
  assertions: INSValidityAssertion[],
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