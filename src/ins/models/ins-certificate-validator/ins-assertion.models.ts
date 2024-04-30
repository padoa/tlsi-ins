export enum InsCertificateSubjectCn {
  INSI_AUTO = 'INSI-AUTO',
  INSI_MANU = 'INSI-MANU',
}

export enum InsCertificateIssuerCn {
  AC_IGC_SANTE = 'AC IGC-SANTE ELEMENTAIRE ORGANISATIONS',
  TEST_AC_IGC_SANTE = 'TEST AC IGC-SANTE ELEMENTAIRE ORGANISATIONS',
}

export enum InsAssertionType {
  SUBJECT_CN = 'SUBJECT CN',
  ISSUER_CN = 'ISSUER CN',
  VALIDITY_DATES = 'VALIDITY DATES',
}

export enum AssertionStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export interface InsAssertionResult {
  status: AssertionStatus,
  message: string,
}
