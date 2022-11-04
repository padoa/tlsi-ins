"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRLabels = exports.CRCodes = exports.INSiServiceRequestStatus = void 0;
var INSiServiceRequestStatus;
(function (INSiServiceRequestStatus) {
    INSiServiceRequestStatus["SUCCESS"] = "SUCCESS";
    INSiServiceRequestStatus["FAIL"] = "FAIL";
})(INSiServiceRequestStatus = exports.INSiServiceRequestStatus || (exports.INSiServiceRequestStatus = {}));
var CRCodes;
(function (CRCodes) {
    CRCodes["OK"] = "00";
    CRCodes["NO_RESULT"] = "01";
    CRCodes["MULTIPLE_MATCHES"] = "02";
})(CRCodes = exports.CRCodes || (exports.CRCodes = {}));
var CRLabels;
(function (CRLabels) {
    CRLabels["OK"] = "OK";
    CRLabels["NO_RESULT"] = "Aucune identite trouvee";
    CRLabels["MULTIPLE_MATCHES"] = "Plusieurs identites trouvees";
})(CRLabels = exports.CRLabels || (exports.CRLabels = {}));
//# sourceMappingURL=insi-fetch-ins.models.js.map