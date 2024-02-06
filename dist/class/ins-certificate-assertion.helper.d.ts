import { TestCertificateForInsResponse } from '../models/ins-certificate-validator/ins-certificate-validator.models';
import { InsCertificateIssuerCn, InsCertificateSubjectCn } from '../models/ins-certificate-validator/ins-assertion.models';
import { PKCS12Certificate } from '../models/ins-certificate-validator/pkcs12-certificate.models';
export declare class InsCertificateAssertionHelper {
    static insCertificateValidIssuerCn: InsCertificateIssuerCn[];
    static insCertificateValidType: InsCertificateSubjectCn[];
    static testCertificateForIns(certificate: PKCS12Certificate): TestCertificateForInsResponse;
    private static _validateAssertion;
    private static _validateSubjectCn;
    private static _validateIssuerCn;
    private static _validateValidityDates;
    private static _getValidityDatesMessage;
    private static _getInsCertificateType;
}
