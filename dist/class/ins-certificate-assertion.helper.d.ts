import { InsCertificateValidity } from '../models/ins-certificate-validator/ins-certificate-validator.models';
import { InsAssertionResult, InsAssertionType, InsCertificateIssuerCn, InsCertificateSubjectCn } from '../models/ins-certificate-validator/ins-assertion.models';
import { PKCS12Certificate } from '../models/ins-certificate-validator/pkcs12-certificate.models';
export declare class InsCertificateAssertionHelper {
    static insCertificateValidIssuerCn: InsCertificateIssuerCn[];
    static insCertificateValidType: InsCertificateSubjectCn[];
    static insCertificateAssertions: InsAssertionType[];
    static testCertificateForIns(certificate: PKCS12Certificate): {
        insCertificateValidity: InsCertificateValidity;
        insAssertions: InsAssertionResult[];
    };
    private static _validateAssertion;
    static _validateSubjectCn(certificate: PKCS12Certificate): InsAssertionResult;
    static _validateIssuerCn(certificate: PKCS12Certificate): InsAssertionResult;
    static _validateValidityDates(certificate: PKCS12Certificate): InsAssertionResult;
    static _getValidityDatesMessage(validity: {
        notBefore: Date;
        notAfter: Date;
    }): string;
}
