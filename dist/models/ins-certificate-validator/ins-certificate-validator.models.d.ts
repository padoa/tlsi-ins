import { PKCS12Certificate } from './pkcs12-certificate.models';
import { InsAssertionResult, InsAssertionType } from './ins-assertion.models';
export declare enum InsCertificateValidity {
    VALID = "VALID",
    INVALID = "INVALID"
}
export interface InsCertificateValidationResponse {
    insCertificateValidity: InsCertificateValidity;
    certificate: PKCS12Certificate | null;
    insAssertions?: Record<InsAssertionType, InsAssertionResult>;
    error?: {
        message: string;
    };
}
