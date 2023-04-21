"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsiHelper = void 0;
const lodash_1 = __importDefault(require("lodash"));
class InsiHelper {
    static formatFetchINSResult(result) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        if (!result.INDIVIDU) {
            return null;
        }
        const ListePrenom = (_b = (_a = result.INDIVIDU) === null || _a === void 0 ? void 0 : _a.TIQ) === null || _b === void 0 ? void 0 : _b.ListePrenom;
        const NumIdentifiant = (_e = (_d = (_c = result.INDIVIDU) === null || _c === void 0 ? void 0 : _c.INSACTIF) === null || _d === void 0 ? void 0 : _d.IdIndividu) === null || _e === void 0 ? void 0 : _e.NumIdentifiant;
        const Cle = (_h = (_g = (_f = result.INDIVIDU) === null || _f === void 0 ? void 0 : _f.INSACTIF) === null || _g === void 0 ? void 0 : _g.IdIndividu) === null || _h === void 0 ? void 0 : _h.Cle;
        return {
            birthName: (_k = (_j = result.INDIVIDU) === null || _j === void 0 ? void 0 : _j.TIQ) === null || _k === void 0 ? void 0 : _k.NomNaissance,
            firstName: ListePrenom ? (_l = ListePrenom.split(' ')) === null || _l === void 0 ? void 0 : _l[0] : undefined,
            allFirstNames: (_o = (_m = result.INDIVIDU) === null || _m === void 0 ? void 0 : _m.TIQ) === null || _o === void 0 ? void 0 : _o.ListePrenom,
            gender: (_q = (_p = result.INDIVIDU) === null || _p === void 0 ? void 0 : _p.TIQ) === null || _q === void 0 ? void 0 : _q.Sexe,
            dateOfBirth: (_s = (_r = result.INDIVIDU) === null || _r === void 0 ? void 0 : _r.TIQ) === null || _s === void 0 ? void 0 : _s.DateNaissance,
            placeOfBirthCode: (_u = (_t = result.INDIVIDU) === null || _t === void 0 ? void 0 : _t.TIQ) === null || _u === void 0 ? void 0 : _u.LieuNaissance,
            registrationNumber: NumIdentifiant && Cle ? `${NumIdentifiant}${Cle}` : undefined,
            oid: (_w = (_v = result.INDIVIDU) === null || _v === void 0 ? void 0 : _v.INSACTIF) === null || _w === void 0 ? void 0 : _w.OID,
        };
    }
    static changeInsHistoToArray(result) {
        var _a, _b;
        if (((_a = result === null || result === void 0 ? void 0 : result.INDIVIDU) === null || _a === void 0 ? void 0 : _a.INSHISTO) && !lodash_1.default.isArray((_b = result === null || result === void 0 ? void 0 : result.INDIVIDU) === null || _b === void 0 ? void 0 : _b.INSHISTO)) {
            result.INDIVIDU.INSHISTO = [result.INDIVIDU.INSHISTO];
        }
        return result;
    }
    static getServiceErrorFromXML(xml) {
        var _a, _b, _c, _d;
        try {
            return {
                siramCode: (_a = xml.match(/(<S:Subcode><S:Value>S:)(.*)(<\/S:Value>)/)) === null || _a === void 0 ? void 0 : _a[2],
                text: (_b = xml.match(/(<S:Text xml:lang="en">)([\S\s]*?)(<\/S:Text>)/)) === null || _b === void 0 ? void 0 : _b[2],
                desirCode: (_c = xml.match(/(code=")(.*?)(")/)) === null || _c === void 0 ? void 0 : _c[2],
                error: (_d = xml.match(/(<siram:Erreur(.*)>)([\S\s]*)(<\/siram:Erreur>)/)) === null || _d === void 0 ? void 0 : _d[3],
            };
        }
        catch (_e) {
            return null;
        }
    }
}
exports.InsiHelper = InsiHelper;
//# sourceMappingURL=insi-helper.js.map