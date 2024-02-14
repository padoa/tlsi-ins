import { InsAssertionResult, InsAssertionType, InsCertificateIssuerCn, InsCertificateSubjectCn } from '../models/ins-certificate-validator/ins-assertion.models';
import { PKCS12Certificate } from '../models/ins-certificate-validator/pkcs12-certificate.models';
export declare class InsCertificateAssertionHelper {
    static insCertificateValidIssuerCn: InsCertificateIssuerCn[];
    static insCertificateValidType: InsCertificateSubjectCn[];
    static checkInsAssertionForCertificate(certificate: PKCS12Certificate): Record<InsAssertionType, InsAssertionResult>;
    private static _validateSubjectCn;
    private static _validateIssuerCn;
    private static _validateValidityDates;
    private static _getValidityDatesMessage;
}
