"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckboxType = exports.MedimailActions = void 0;
var MedimailActions;
(function (MedimailActions) {
    MedimailActions["HELLO"] = "hello";
    MedimailActions["SEND"] = "send";
    MedimailActions["OPEN"] = "open";
    MedimailActions["CHECKBOX"] = "checkbox";
})(MedimailActions || (exports.MedimailActions = MedimailActions = {}));
var CheckboxType;
(function (CheckboxType) {
    CheckboxType[CheckboxType["ALL_MESSAGES"] = 1] = "ALL_MESSAGES";
    CheckboxType[CheckboxType["RECEIVED_MESSAGES"] = 2] = "RECEIVED_MESSAGES";
    CheckboxType[CheckboxType["SENT_MESSAGES"] = 3] = "SENT_MESSAGES";
})(CheckboxType || (exports.CheckboxType = CheckboxType = {}));
//# sourceMappingURL=medimail.types.js.map