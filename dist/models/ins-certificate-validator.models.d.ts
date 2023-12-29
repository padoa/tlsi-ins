export declare enum INSCertificateValidity {
    VALID = "VALID",
    INVALID = "INVALID"
}
export declare enum AssertionType {
    SUBJECT_CN = "SUBJECT CN",
    ISSUER_CN = "ISSUER CN",
    VAILIDITY_DATES = "VALIDITY DATES",
    PKCS12_CERTIFICATE = "PKCS12 CERTIFICATE"
}
export declare enum AssertionStatus {
    SUCCESS = "SUCCESS",
    FAIL = "FAIL"
}
export interface INSValidityAssertion {
    type: AssertionType;
    status: AssertionStatus;
    message: string;
}
export interface IINSValidationResponse {
    certificateValidity: INSCertificateValidity;
    assertions: INSValidityAssertion[];
    error?: {
        message: string;
    };
}
export interface IValidityDates {
    notBefore: Date;
    notAfter: Date;
}
export interface IPKCS12Certificate {
    pfx: string;
    subjectCN: string;
    issuerCN: string;
    validity: IValidityDates;
}
export interface ICertificateValidityResponse {
    isValid: boolean;
    pkcsError?: string;
    pkcsAssertions?: INSValidityAssertion[];
    insCallFailed?: boolean;
}
