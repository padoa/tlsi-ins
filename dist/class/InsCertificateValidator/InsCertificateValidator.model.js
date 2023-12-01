"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssertionStatus = exports.AssertionType = exports.INSCertificateValidity = void 0;
var INSCertificateValidity;
(function (INSCertificateValidity) {
    INSCertificateValidity["VALID"] = "VALID";
    INSCertificateValidity["INVALID"] = "INVALID";
})(INSCertificateValidity || (exports.INSCertificateValidity = INSCertificateValidity = {}));
var AssertionType;
(function (AssertionType) {
    AssertionType["SUBJECT_CN"] = "SUBJECT CN";
    AssertionType["ISSUER_CN"] = "ISSUER CN";
    AssertionType["VAILIDITY_DATES"] = "VALIDITY DATES";
})(AssertionType || (exports.AssertionType = AssertionType = {}));
var AssertionStatus;
(function (AssertionStatus) {
    AssertionStatus["SUCCESS"] = "SUCCESS";
    AssertionStatus["FAIL"] = "FAIL";
})(AssertionStatus || (exports.AssertionStatus = AssertionStatus = {}));
//# sourceMappingURL=InsCertificateValidator.model.js.map