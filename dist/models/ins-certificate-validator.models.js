"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssertionStatus = exports.AssertionType = exports.ICertificateType = exports.INSCertificateValidity = void 0;
var INSCertificateValidity;
(function (INSCertificateValidity) {
    INSCertificateValidity["VALID"] = "VALID";
    INSCertificateValidity["INVALID"] = "INVALID";
})(INSCertificateValidity || (exports.INSCertificateValidity = INSCertificateValidity = {}));
var ICertificateType;
(function (ICertificateType) {
    ICertificateType["INSI_AUTO"] = "INSI-AUTO";
    ICertificateType["INSI_MANU"] = "INSI-MANU";
    ICertificateType["OTHER"] = "OTHER";
})(ICertificateType || (exports.ICertificateType = ICertificateType = {}));
var AssertionType;
(function (AssertionType) {
    AssertionType["SUBJECT_CN"] = "SUBJECT CN";
    AssertionType["ISSUER_CN"] = "ISSUER CN";
    AssertionType["VAILIDITY_DATES"] = "VALIDITY DATES";
    AssertionType["PKCS12_CERTIFICATE"] = "PKCS12 CERTIFICATE";
})(AssertionType || (exports.AssertionType = AssertionType = {}));
var AssertionStatus;
(function (AssertionStatus) {
    AssertionStatus["SUCCESS"] = "SUCCESS";
    AssertionStatus["FAIL"] = "FAIL";
})(AssertionStatus || (exports.AssertionStatus = AssertionStatus = {}));
//# sourceMappingURL=ins-certificate-validator.models.js.map