"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsiHelper = void 0;
class InsiHelper {
    static formatFetchINSRawResponse(rawResponse) {
        var _a;
        if (!rawResponse.INDIVIDU) {
            return null;
        }
        const { NumIdentifiant, Cle } = rawResponse.INDIVIDU.INSACTIF.IdIndividu;
        return {
            birthName: rawResponse.INDIVIDU.TIQ.NomNaissance,
            firstName: (_a = rawResponse.INDIVIDU.TIQ.ListePrenom.split(" ")) === null || _a === void 0 ? void 0 : _a[0],
            allFirstNames: rawResponse.INDIVIDU.TIQ.ListePrenom,
            gender: rawResponse.INDIVIDU.TIQ.Sexe,
            dateOfBirth: rawResponse.INDIVIDU.TIQ.DateNaissance,
            placeOfBirthCode: rawResponse.INDIVIDU.TIQ.LieuNaissance,
            socialSecurityNumber: `${NumIdentifiant}${Cle}`,
            oid: rawResponse.INDIVIDU.INSACTIF.OID,
        };
    }
}
exports.InsiHelper = InsiHelper;
//# sourceMappingURL=insi-helper.js.map