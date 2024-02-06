import { PKCS12Certificate } from './pkcs12-certificate.models';
import { InsAssertionResult, InsAssertionType } from './ins-assertion.models';
export declare enum InsCertificateValidity {
    VALID = "VALID",
    INVALID = "INVALID"
}
export declare enum InsCertificateType {
    INSI_AUTO = "INSI-AUTO",
    INSI_MANU = "INSI-MANU",
    UNKNOWN = "UNKNOWN"
}
export interface TestCertificateForInsResponse {
    insCertificateValidity: InsCertificateValidity;
    insCertificateType: InsCertificateType;
    insAssertions: Record<InsAssertionType, InsAssertionResult>;
}
export interface InsCertificateValidationResponse {
    insCertificateValidity: InsCertificateValidity;
    insCertificateType: InsCertificateType;
    certificate: PKCS12Certificate | null;
    insAssertions?: Record<InsAssertionType, InsAssertionResult>;
    error?: {
        message: string;
    };
}
