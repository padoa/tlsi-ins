"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TchitchiOlaVirtualMode = void 0;
const insi_person_class_1 = require("../../class/insi-person.class");
const BasicVirtualMode_1 = __importDefault(require("./BasicVirtualMode"));
const insi_fetch_ins_models_1 = require("../../models/insi-fetch-ins.models");
class TchitchiOlaVirtualMode extends BasicVirtualMode_1.default {
}
TchitchiOlaVirtualMode.insHisto = [];
TchitchiOlaVirtualMode.personDetails = {
    firstName: 'CATARINA',
    birthName: 'TCHITCHI',
    allFirstNames: 'CATARINA BELLA',
    gender: insi_person_class_1.Gender.Female,
    placeOfBirthCode: '63220',
    dateOfBirth: '1936-06-21',
    registrationNumber: '236066322083656',
    oid: '1.2.250.1.213.1.4.8',
};
TchitchiOlaVirtualMode.fetchRequestFlow = [{
        codeCR: insi_fetch_ins_models_1.CRCodes.NO_RESULT,
        LibelleCR: insi_fetch_ins_models_1.CRLabels.NO_RESULT,
        firstnameRequest: 'OLA',
    }, {
        codeCR: insi_fetch_ins_models_1.CRCodes.OK,
        LibelleCR: insi_fetch_ins_models_1.CRLabels.OK,
        firstnameRequest: 'CATARINA',
    }];
exports.TchitchiOlaVirtualMode = TchitchiOlaVirtualMode;
//# sourceMappingURL=TchitchiOlaVirtualMode.js.map