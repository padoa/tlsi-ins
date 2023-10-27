"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HouillesPierreVirtualMode = void 0;
const insi_person_class_1 = require("../../class/insi-person.class");
const BasicVirtualMode_1 = __importDefault(require("./BasicVirtualMode"));
const insi_fetch_ins_models_1 = require("../../models/insi-fetch-ins.models");
class HouillesPierreVirtualMode extends BasicVirtualMode_1.default {
}
HouillesPierreVirtualMode.insHisto = [];
HouillesPierreVirtualMode.personDetails = {
    firstName: '',
    birthName: 'HOUILLES',
    allFirstNames: 'PIERRE PAUL JACQUES',
    gender: insi_person_class_1.Gender.Male,
    dateOfBirth: '1993-01-27',
};
HouillesPierreVirtualMode.fetchRequestFlow = [{
        firstnameRequest: 'PIERRE',
        codeCR: insi_fetch_ins_models_1.CRCodes.NO_RESULT,
        LibelleCR: insi_fetch_ins_models_1.CRLabels.NO_RESULT,
    }, {
        firstnameRequest: 'PAUL',
        codeCR: insi_fetch_ins_models_1.CRCodes.NO_RESULT,
        LibelleCR: insi_fetch_ins_models_1.CRLabels.NO_RESULT,
    }, {
        firstnameRequest: 'JACQUES',
        codeCR: insi_fetch_ins_models_1.CRCodes.NO_RESULT,
        LibelleCR: insi_fetch_ins_models_1.CRLabels.NO_RESULT,
    }, {
        firstnameRequest: 'PIERRE PAUL JACQUES',
        codeCR: insi_fetch_ins_models_1.CRCodes.NO_RESULT,
        LibelleCR: insi_fetch_ins_models_1.CRLabels.NO_RESULT,
    }];
exports.HouillesPierreVirtualMode = HouillesPierreVirtualMode;
//# sourceMappingURL=HouillesPierreVirtualMode.js.map