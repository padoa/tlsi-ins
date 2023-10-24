"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorseAnthonyVirtualMode = void 0;
const insi_person_class_1 = require("../../class/insi-person.class");
const BasicVirtualMode_1 = __importDefault(require("./BasicVirtualMode"));
const insi_fetch_ins_models_1 = require("../../models/insi-fetch-ins.models");
class CorseAnthonyVirtualMode extends BasicVirtualMode_1.default {
}
CorseAnthonyVirtualMode.insHisto = [
    {
        IdIndividu: {
            NumIdentifiant: "180032B020401",
            Cle: "23"
        },
        OID: "1.2.250.1.213.1.4.8"
    }
];
CorseAnthonyVirtualMode.personDetails = {
    firstName: 'ANTHONY',
    birthName: 'CORSE',
    allFirstNames: 'ANTHONY',
    gender: insi_person_class_1.Gender.Male,
    placeOfBirthCode: '2B020',
    dateOfBirth: '1980-03-02',
    registrationNumber: '180032B02040123',
    oid: '1.2.250.1.213.1.4.8',
};
CorseAnthonyVirtualMode.fetchRequestFlow = [{
        codeCR: insi_fetch_ins_models_1.CRCodes.OK,
        LibelleCR: insi_fetch_ins_models_1.CRLabels.OK,
        firstnameRequest: 'ANTHONY',
    }];
exports.CorseAnthonyVirtualMode = CorseAnthonyVirtualMode;
//# sourceMappingURL=CorseAnthonyVirtualMode.js.map