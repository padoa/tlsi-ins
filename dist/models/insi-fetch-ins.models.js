"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INSITestingUser = exports.CRLabels = exports.CRCodes = exports.INSiServiceRequestStatus = void 0;
var INSiServiceRequestStatus;
(function (INSiServiceRequestStatus) {
    INSiServiceRequestStatus["SUCCESS"] = "SUCCESS";
    INSiServiceRequestStatus["FAIL"] = "FAIL";
})(INSiServiceRequestStatus || (exports.INSiServiceRequestStatus = INSiServiceRequestStatus = {}));
var CRCodes;
(function (CRCodes) {
    CRCodes["OK"] = "00";
    CRCodes["NO_RESULT"] = "01";
    CRCodes["MULTIPLE_MATCHES"] = "02";
})(CRCodes || (exports.CRCodes = CRCodes = {}));
var CRLabels;
(function (CRLabels) {
    CRLabels["OK"] = "OK";
    CRLabels["NO_RESULT"] = "Aucune identite trouvee";
    CRLabels["MULTIPLE_MATCHES"] = "Plusieurs identites trouvees";
})(CRLabels || (exports.CRLabels = CRLabels = {}));
var INSITestingUser;
(function (INSITestingUser) {
    INSITestingUser["ADRUN"] = "adrun zoe";
    INSITestingUser["CORSE"] = "corse anthony";
    INSITestingUser["ECETINSI"] = "ecetinsi pierre-alain";
    INSITestingUser["HERMAN"] = "hermann gatien";
    INSITestingUser["HOUILLES"] = "houilles pierre";
    INSITestingUser["NESSIMICHELANGELO"] = "nessi michelangelo";
    INSITestingUser["TCHITCHI"] = "tchitchi ola catarina bella";
})(INSITestingUser || (exports.INSITestingUser = INSITestingUser = {}));
//# sourceMappingURL=insi-fetch-ins.models.js.map