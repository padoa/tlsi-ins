"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdrunZoeVirtualMode = void 0;
const insi_person_class_1 = require("../../class/insi-person.class");
const BasicVirtualMode_1 = __importDefault(require("./BasicVirtualMode"));
const insi_fetch_ins_models_1 = require("../../models/insi-fetch-ins.models");
class AdrunZoeVirtualMode extends BasicVirtualMode_1.default {
}
exports.AdrunZoeVirtualMode = AdrunZoeVirtualMode;
AdrunZoeVirtualMode.insHisto = [];
AdrunZoeVirtualMode.personDetails = {
    firstName: 'ZOE',
    birthName: 'ADRUN',
    allFirstNames: 'ZOE',
    gender: insi_person_class_1.Gender.Female,
    placeOfBirthCode: '63220',
    dateOfBirth: '1975-12-31',
    registrationNumber: '275126322074974',
    oid: '1.2.250.1.213.1.4.8',
};
AdrunZoeVirtualMode.fetchRequestFlow = [{
        codeCR: insi_fetch_ins_models_1.CRCodes.OK,
        LibelleCR: insi_fetch_ins_models_1.CRLabels.OK,
        firstnameRequest: 'ZOE',
    }];
//# sourceMappingURL=AdrunZoeVirtualMode.js.map