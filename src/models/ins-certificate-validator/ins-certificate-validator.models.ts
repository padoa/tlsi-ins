import { PKCS12Certificate } from './pkcs12-certificate.models';
import { InsAssertionResult, InsAssertionType, InsCertificateSubjectCn } from './ins-assertion.models';

export enum InsCertificateValidity {
  VALID = 'VALID',
  INVALID = 'INVALID',
}

export enum InsCertificateType {
  INSI_AUTO = InsCertificateSubjectCn.INSI_AUTO,
  INSI_MANU = InsCertificateSubjectCn.INSI_MANU,
  UNKNOWN = 'UNKNOWN',
}

export interface TestCertificateForInsResponse {
  insCertificateValidity: InsCertificateValidity;
  insCertificateType: InsCertificateType;
  insAssertions: Record<InsAssertionType, InsAssertionResult>;
}

export interface InsCertificateValidationResponse {
  insCertificateValidity: InsCertificateValidity,
  insCertificateType: InsCertificateType,
  certificate: PKCS12Certificate | null;
  insAssertions?: Record<InsAssertionType, InsAssertionResult>,
  error?: { message: string },
}
