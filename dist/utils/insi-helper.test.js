"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const insi_helper_1 = require("./insi-helper");
const insi_fetch_ins_models_1 = require("../models/insi-fetch-ins.models");
const insi_person_class_1 = require("../class/insi-person.class");
describe('INSi Helper - ', () => {
    describe('formatFetchINSResult - ', () => {
        test('should return formatted result', () => {
            const okResult = {
                CR: {
                    CodeCR: insi_fetch_ins_models_1.CRCodes.OK,
                    LibelleCR: insi_fetch_ins_models_1.CRLabels.OK,
                },
                INDIVIDU: {
                    INSACTIF: {
                        IdIndividu: {
                            NumIdentifiant: '297022A020778',
                            Cle: '78'
                        },
                        OID: '1.2.250.1.213.1.4.8'
                    },
                    TIQ: {
                        NomNaissance: 'ADRTROIS',
                        ListePrenom: 'DOMINIQUE',
                        Sexe: insi_person_class_1.Gender.Female,
                        DateNaissance: '1997-02-26',
                        LieuNaissance: '2A020'
                    }
                }
            };
            const formattedResult = insi_helper_1.InsiHelper.formatFetchINSResult(okResult);
            expect(formattedResult).toStrictEqual({
                birthName: 'ADRTROIS',
                firstName: 'DOMINIQUE',
                allFirstNames: 'DOMINIQUE',
                gender: insi_person_class_1.Gender.Female,
                dateOfBirth: '1997-02-26',
                placeOfBirthCode: '2A020',
                registrationNumber: '297022A02077878',
                oid: '1.2.250.1.213.1.4.8',
            });
        });
        test('should return null if INDIVIDU is missing', () => {
            const noResult = {
                CR: {
                    CodeCR: insi_fetch_ins_models_1.CRCodes.NO_RESULT,
                    LibelleCR: insi_fetch_ins_models_1.CRLabels.NO_RESULT,
                },
            };
            const formattedResult = insi_helper_1.InsiHelper.formatFetchINSResult(noResult);
            expect(formattedResult).toStrictEqual(null);
        });
        test('should not fail if ListePrenom is missing', () => {
            const missingListePrenomResult = {
                CR: {
                    CodeCR: insi_fetch_ins_models_1.CRCodes.OK,
                    LibelleCR: insi_fetch_ins_models_1.CRLabels.OK,
                },
                INDIVIDU: {
                    INSACTIF: {
                        IdIndividu: {
                            NumIdentifiant: '297022A020778',
                            Cle: '78'
                        },
                        OID: '1.2.250.1.213.1.4.8'
                    },
                    TIQ: {
                        NomNaissance: 'ADRTROIS',
                        Sexe: insi_person_class_1.Gender.Female,
                        DateNaissance: '1997-02-26',
                        LieuNaissance: '2A020'
                    }
                }
            };
            const formattedResult = insi_helper_1.InsiHelper.formatFetchINSResult(missingListePrenomResult);
            expect(formattedResult).toStrictEqual({
                birthName: 'ADRTROIS',
                firstName: undefined,
                allFirstNames: undefined,
                gender: insi_person_class_1.Gender.Female,
                dateOfBirth: '1997-02-26',
                placeOfBirthCode: '2A020',
                registrationNumber: '297022A02077878',
                oid: '1.2.250.1.213.1.4.8',
            });
        });
    });
    describe('getServiceErrorFromXML - ', () => {
        test('should format technical error', () => {
            const xmlError = '<?xml version="1.0" encoding="UTF-8"?>\n<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"><env:Body xmlns:S="http://www.w3.org/2003/05/soap-envelope" xmlns:env="http://www.w3.org/2003/05/soap-envelope"><S:Fault xmlns:ns4="http://schemas.xmlsoap.org/soap/envelope/"><S:Code><S:Value>S:Receiver</S:Value><S:Subcode><S:Value>S:siram_40</S:Value></S:Subcode></S:Code><S:Reason><S:Text xml:lang="en">Le service est temporairement inaccessible. Veuillez renouveler votre demande ultérieurement. Si le problème persiste, contactez l\'éditeur du progiciel ou votre responsable informatique.</S:Text></S:Reason><S:Detail><siram:Erreur severite="fatal" code="insi_102" xmlns:siram="urn:siram">L\'appel au service de recherche avec les traits d\'identité renvoie une erreur technique.</siram:Erreur></S:Detail></S:Fault></env:Body></soap:Envelope>';
            const serviceError = insi_helper_1.InsiHelper.getServiceErrorFromXML(xmlError);
            expect(serviceError).toStrictEqual({
                desirCode: 'insi_102',
                error: 'L\'appel au service de recherche avec les traits d\'identité renvoie une erreur technique.',
                siramCode: 'siram_40',
                text: 'Le service est temporairement inaccessible. Veuillez renouveler votre demande ultérieurement. Si le problème persiste, contactez l\'éditeur du progiciel ou votre responsable informatique.',
            });
        });
    });
});
//# sourceMappingURL=insi-helper.test.js.map