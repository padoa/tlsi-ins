export declare enum InsCertificateSubjectCn {
    INSI_AUTO = "INSI-AUTO",
    INSI_MANU = "INSI-MANU"
}
export declare enum InsCertificateIssuerCn {
    AC_IGC_SANTE = "AC IGC-SANTE ELEMENTAIRE ORGANISATIONS",
    TEST_AC_IGC_SANTE = "TEST AC IGC-SANTE ELEMENTAIRE ORGANISATIONS"
}
export declare enum InsAssertionType {
    SUBJECT_CN = "SUBJECT CN",
    ISSUER_CN = "ISSUER CN",
    VALIDITY_DATES = "VALIDITY DATES"
}
export declare enum AssertionStatus {
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE"
}
export interface InsAssertionResult {
    status: AssertionStatus;
    message: string;
}
