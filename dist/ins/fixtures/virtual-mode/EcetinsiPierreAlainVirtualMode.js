"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcetinsiPierreAlainVirtualMode = void 0;
const insi_person_class_1 = require("../../class/insi-person.class");
const BasicVirtualMode_1 = __importDefault(require("./BasicVirtualMode"));
const insi_fetch_ins_models_1 = require("../../models/insi-fetch-ins.models");
class EcetinsiPierreAlainVirtualMode extends BasicVirtualMode_1.default {
}
exports.EcetinsiPierreAlainVirtualMode = EcetinsiPierreAlainVirtualMode;
EcetinsiPierreAlainVirtualMode.insHisto = [
    {
        IdIndividu: {
            NumIdentifiant: "2090763220834",
            Cle: "39",
            TypeMatricule: "NIR"
        },
        OID: "1.2.250.1.213.1.4.8"
    },
    {
        IdIndividu: {
            NumIdentifiant: "2090663220123",
            Cle: "55",
            TypeMatricule: "NIR"
        },
        OID: "1.2.250.1.213.1.4.8"
    }
];
EcetinsiPierreAlainVirtualMode.personDetails = {
    firstName: 'PIERRE-ALAIN',
    birthName: 'ECETINSI',
    allFirstNames: 'PIERRE-ALAIN MURIEL FLORIANT',
    gender: insi_person_class_1.Gender.Male,
    placeOfBirthCode: '63220',
    dateOfBirth: '2009-07-14',
    registrationNumber: '109076322083489',
    oid: '1.2.250.1.213.1.4.8',
};
EcetinsiPierreAlainVirtualMode.fetchRequestFlow = [{
        codeCR: insi_fetch_ins_models_1.CRCodes.OK,
        LibelleCR: insi_fetch_ins_models_1.CRLabels.OK,
        firstnameRequest: 'PIERRE-ALAIN',
    }];
//# sourceMappingURL=EcetinsiPierreAlainVirtualMode.js.map