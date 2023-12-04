"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INSiSoapActions = exports.INSiSoapActionsName = void 0;
var INSiSoapActionsName;
(function (INSiSoapActionsName) {
    INSiSoapActionsName["FETCH_FROM_IDENTITY_TRAITS"] = "FETCH_FROM_IDENTITY_TRAITS";
})(INSiSoapActionsName || (exports.INSiSoapActionsName = INSiSoapActionsName = {}));
exports.INSiSoapActions = {
    [INSiSoapActionsName.FETCH_FROM_IDENTITY_TRAITS]: {
        header: { Action: 'urn:ServiceIdentiteCertifiee:1.0.0:rechercherInsAvecTraitsIdentite' },
        method: 'rechercherInsAvecTraitsIdentite',
    },
};
//# sourceMappingURL=insi-soap-action.models.js.map