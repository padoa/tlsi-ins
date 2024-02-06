"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssertionStatus = exports.InsAssertionType = exports.InsCertificateIssuerCn = exports.InsCertificateSubjectCn = void 0;
var InsCertificateSubjectCn;
(function (InsCertificateSubjectCn) {
    InsCertificateSubjectCn["INSI_AUTO"] = "INSI-AUTO";
    InsCertificateSubjectCn["INSI_MANU"] = "INSI-MANU";
})(InsCertificateSubjectCn || (exports.InsCertificateSubjectCn = InsCertificateSubjectCn = {}));
var InsCertificateIssuerCn;
(function (InsCertificateIssuerCn) {
    InsCertificateIssuerCn["AC_IGC_SANTE"] = "AC IGC-SANTE ELEMENTAIRE ORGANISATIONS";
    InsCertificateIssuerCn["TEST_AC_IGC_SANTE"] = "TEST AC IGC-SANTE ELEMENTAIRE ORGANISATIONS";
})(InsCertificateIssuerCn || (exports.InsCertificateIssuerCn = InsCertificateIssuerCn = {}));
var InsAssertionType;
(function (InsAssertionType) {
    InsAssertionType["SUBJECT_CN"] = "SUBJECT CN";
    InsAssertionType["ISSUER_CN"] = "ISSUER CN";
    InsAssertionType["VALIDITY_DATES"] = "VALIDITY DATES";
    InsAssertionType["UNKNOWN"] = "UNKNOWN";
})(InsAssertionType || (exports.InsAssertionType = InsAssertionType = {}));
var AssertionStatus;
(function (AssertionStatus) {
    AssertionStatus["SUCCESS"] = "SUCCESS";
    AssertionStatus["FAILURE"] = "FAILURE";
})(AssertionStatus || (exports.AssertionStatus = AssertionStatus = {}));
//# sourceMappingURL=ins-assertion.models.js.map