"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HermanGatienVirtualMode = void 0;
const insi_person_class_1 = require("../../class/insi-person.class");
const BasicVirtualMode_1 = __importDefault(require("./BasicVirtualMode"));
const insi_fetch_ins_models_1 = require("../../models/insi-fetch-ins.models");
class HermanGatienVirtualMode extends BasicVirtualMode_1.default {
}
HermanGatienVirtualMode.insHisto = [
    {
        IdIndividu: {
            NumIdentifiant: "1810363220456",
            Cle: "60"
        },
        OID: "1.2.250.1.213.1.4.8"
    },
    {
        IdIndividu: {
            NumIdentifiant: "2810363220456",
            Cle: "10"
        },
        OID: "1.2.250.1.213.1.4.8"
    }
];
HermanGatienVirtualMode.personDetails = {
    firstName: 'GATIEN',
    birthName: 'HERMANN',
    allFirstNames: 'GATIEN',
    gender: insi_person_class_1.Gender.Male,
    placeOfBirthCode: '63220',
    dateOfBirth: '1981-03-24',
    registrationNumber: '181036322045660',
    oid: '1.2.250.1.213.1.4.8',
};
HermanGatienVirtualMode.fetchRequestFlow = [{
        codeCR: insi_fetch_ins_models_1.CRCodes.OK,
        LibelleCR: insi_fetch_ins_models_1.CRLabels.OK,
        firstnameRequest: 'GATIEN',
    }];
exports.HermanGatienVirtualMode = HermanGatienVirtualMode;
//# sourceMappingURL=HermanGatienVirtualMode.js.map