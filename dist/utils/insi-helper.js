"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsiHelper = void 0;
const lodash_1 = __importDefault(require("lodash"));
class InsiHelper {
    static formatFetchINSResult(result) {
        var _a;
        if (!result.INDIVIDU) {
            return null;
        }
        const { NumIdentifiant, Cle } = result.INDIVIDU.INSACTIF.IdIndividu;
        return {
            birthName: result.INDIVIDU.TIQ.NomNaissance,
            firstName: (_a = result.INDIVIDU.TIQ.ListePrenom.split(' ')) === null || _a === void 0 ? void 0 : _a[0],
            allFirstNames: result.INDIVIDU.TIQ.ListePrenom,
            gender: result.INDIVIDU.TIQ.Sexe,
            dateOfBirth: result.INDIVIDU.TIQ.DateNaissance,
            placeOfBirthCode: result.INDIVIDU.TIQ.LieuNaissance,
            socialSecurityNumber: `${NumIdentifiant}${Cle}`,
            oid: result.INDIVIDU.INSACTIF.OID,
        };
    }
    static changeInsHistoToArray(result) {
        var _a, _b;
        if (((_a = result === null || result === void 0 ? void 0 : result.INDIVIDU) === null || _a === void 0 ? void 0 : _a.INSHISTO) && !lodash_1.default.isArray((_b = result === null || result === void 0 ? void 0 : result.INDIVIDU) === null || _b === void 0 ? void 0 : _b.INSHISTO)) {
            result.INDIVIDU.INSHISTO = [result.INDIVIDU.INSHISTO];
        }
        return result;
    }
}
exports.InsiHelper = InsiHelper;
//# sourceMappingURL=insi-helper.js.map