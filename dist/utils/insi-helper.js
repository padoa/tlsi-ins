"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsiHelper = void 0;
class InsiHelper {
    static formatFetchINSRawResponse(rawResponse) {
        const { NumIdentifiant, Cle } = rawResponse.INDIVIDU.INSACTIF.IdIndividu;
        return {
            formerName: rawResponse.INDIVIDU.TIQ.NomNaissance,
            firstName: rawResponse.INDIVIDU.TIQ.Prenom,
            firstNameList: rawResponse.INDIVIDU.TIQ.ListePrenom,
            gender: rawResponse.INDIVIDU.TIQ.Sexe,
            birthName: rawResponse.INDIVIDU.TIQ.DateNaissance,
            birthPlaceCode: rawResponse.INDIVIDU.TIQ.LieuNaissance,
            socialSecurityNumber: `${NumIdentifiant}${Cle}`,
            oid: rawResponse.INDIVIDU.INSACTIF.OID,
        };
    }
}
exports.InsiHelper = InsiHelper;
//# sourceMappingURL=insi-helper.js.map