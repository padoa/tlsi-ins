"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NessiMichelangeloVirtualMode = void 0;
const insi_person_class_1 = require("../../class/insi-person.class");
const BasicVirtualMode_1 = __importDefault(require("./BasicVirtualMode"));
const insi_fetch_ins_models_1 = require("../../models/insi-fetch-ins.models");
class NessiMichelangeloVirtualMode extends BasicVirtualMode_1.default {
}
NessiMichelangeloVirtualMode.insHisto = [];
NessiMichelangeloVirtualMode.personDetails = {
    firstName: 'MICHELANGELO',
    birthName: 'NESSI',
    allFirstNames: 'MICHELANGELO ANTHONY',
    gender: insi_person_class_1.Gender.Male,
    placeOfBirthCode: '63220',
    dateOfBirth: '2010-08-07',
    registrationNumber: '110086322083060',
    oid: '1.2.250.1.213.1.4.8',
};
NessiMichelangeloVirtualMode.fetchRequestFlow = [{
        codeCR: insi_fetch_ins_models_1.CRCodes.OK,
        LibelleCR: insi_fetch_ins_models_1.CRLabels.OK,
        firstnameRequest: 'MICHELANGELO',
    }];
exports.NessiMichelangeloVirtualMode = NessiMichelangeloVirtualMode;
//# sourceMappingURL=NessiMichelangeloVirtualMode.js.map