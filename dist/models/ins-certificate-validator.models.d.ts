export declare enum INSCertificateValidity {
    VALID = "VALID",
    INVALID = "INVALID"
}
export declare enum ICertificateType {
    INSI_AUTO = "INSI-AUTO",
    INSI_MANU = "INSI-MANU",
    OTHER = "OTHER"
}
export declare enum InsIssuerCn {
    AC_IGC_SANTE = "AC IGC-SANTE ELEMENTAIRE ORGANISATIONS",
    TEST_AC_IGC_SANTE = "TEST AC IGC-SANTE ELEMENTAIRE ORGANISATIONS"
}
export declare enum AssertionType {
    SUBJECT_CN = "SUBJECT CN",
    ISSUER_CN = "ISSUER CN",
    VALIDITY_DATES = "VALIDITY DATES",
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
export interface IINSValidationResponseMetadata {
    certificateType: ICertificateType;
    endDate: Date;
}
export interface IINSValidationResponse {
    certificateValidity: INSCertificateValidity;
    assertions: INSValidityAssertion[];
    error?: {
        message: string;
    };
    metadata: IINSValidationResponseMetadata;
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
