import { PKCS12Certificate } from './pkcs12-certificate.models';
import { InsAssertionResult, InsAssertionType } from './ins-assertion.models';
export declare enum InsCertificateValidity {
    VALID = "VALID",
    INVALID = "INVALID"
}
export declare enum InsCertificateType {
    INSI_AUTO = "INSI-AUTO",
    INSI_MANU = "INSI-MANU"
}
export type CheckInsCertificateResult = InvalidInsCertificateResult | ValidInsCertificateResult;
export type InvalidInsCertificateResult = {
    insCertificateValidity: InsCertificateValidity.INVALID;
    insCertificateType: null;
    certificate: null;
    error: {
        message: string;
    };
} | {
    insCertificateValidity: InsCertificateValidity.INVALID;
    insCertificateType: null;
    insAssertions: Record<InsAssertionType, InsAssertionResult>;
    certificate: PKCS12Certificate;
};
export type ValidInsCertificateResult = {
    insCertificateValidity: InsCertificateValidity.VALID;
    insCertificateType: InsCertificateType;
    insAssertions: Record<InsAssertionType, InsAssertionResult>;
    certificate: PKCS12Certificate;
};
