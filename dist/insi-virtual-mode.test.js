"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lps_class_1 = require("./class/lps.class");
const env_1 = require("./models/env");
const lps_context_class_1 = require("./class/lps-context.class");
const bam_context_class_1 = require("./class/bam-context.class");
const insi_client_service_1 = require("./insi-client.service");
const insi_person_class_1 = require("./class/insi-person.class");
const insi_client_fixture_1 = require("./fixtures/insi-client.fixture");
const xml_request_tester_1 = require("./test/xml-request-tester");
const getClientWithDefinedId = (overrideSpecialCases = true) => {
    const lps = new lps_class_1.LPS({
        idam: env_1.IDAM,
        version: env_1.SOFTWARE_VERSION,
        name: env_1.SOFTWARE_NAME,
        id: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
    });
    const lpsContext = new lps_context_class_1.LpsContext({
        emitter: 'medecin@yopmail.com',
        lps,
    });
    const bamContext = new bam_context_class_1.BamContext({
        emitter: 'medecin@yopmail.com',
    });
    return new insi_client_service_1.INSiClient({
        lpsContext,
        bamContext,
        overrideSpecialCases,
    });
};
beforeEach(() => {
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2023-01-01T00:00:00.000Z');
    jest.spyOn(insi_client_service_1.INSiClient.prototype, 'getLpsContextEmitter').mockReturnValue('medecin@yopmail.com');
    jest.mock('./class/bam-context.class', () => ({
        BamContext: jest.fn((config) => ({
            getSoapHeaderAsJson: () => {
                const soapHeader = {
                    ContexteBAM: {
                        attributes: {
                            Version: '01_02',
                        },
                        Id: insi_client_fixture_1.defaultUuid,
                        Temps: new Date(insi_client_fixture_1.defaultDate).toISOString(),
                        Emetteur: config.emitter,
                        COUVERTURE: {},
                    },
                };
                const name = 'ContexteBAM';
                const namespace = 'ctxbam';
                return { soapHeader, name, namespace };
            },
        })),
    }));
    jest.mock('./class/lps-context.class', () => ({
        LpsContext: jest.fn((config) => ({
            getSoapHeaderAsJson: () => {
                const soapHeader = {
                    ContexteLPS: {
                        attributes: {
                            Nature: 'CTXLPS',
                            Version: '01_00',
                        },
                        Id: insi_client_fixture_1.defaultUuid,
                        Temps: new Date(insi_client_fixture_1.defaultDate).toISOString(),
                        Emetteur: config.emitter,
                        LPS: config.lps.getSoapHeaderAsJson(),
                    },
                };
                const name = 'ContexteLPS';
                const namespace = 'ctxlps';
                return { soapHeader, name, namespace };
            },
        })),
    }));
});
afterEach(() => {
    jest.restoreAllMocks();
});
describe('INSi Client', () => {
    let insiClient;
    describe('Initialisation', () => {
        test('should be able to create a new INSi client without throwing', () => {
            insiClient = getClientWithDefinedId();
        });
        test('should get correct response for ADRUN ZOE', () => __awaiter(void 0, void 0, void 0, function* () {
            const requestId = '7871dedb-2add-47db-8b76-117f8144a840';
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'ADRUN',
                firstName: 'ZOE',
                gender: insi_person_class_1.Gender.Female,
                dateOfBirth: '1975-12-31',
            });
            const personDetails = Object.assign(Object.assign({}, person.getPerson()), { registrationNumber: '275126322074974', oid: '1.2.250.1.213.1.4.8', placeOfBirthCode: '63220', allFirstNames: 'ZOE' });
            const fetchInsResult = yield insiClient.fetchIns(person, { requestId, virtualModeEnabled: true });
            expect(fetchInsResult).toEqual({
                successRequest: {
                    "status": "SUCCESS",
                    "request": {
                        "id": expect.any(String),
                        "xml": (0, xml_request_tester_1.getXmlRequestTest)({ idam: env_1.IDAM, version: env_1.SOFTWARE_VERSION, name: env_1.SOFTWARE_NAME, person: person.getPerson(), requestId })
                    },
                    "response": {
                        "formatted": {
                            "birthName": "ADRUN",
                            "firstName": "ZOE",
                            "allFirstNames": "ZOE",
                            "gender": "F",
                            "dateOfBirth": "1975-12-31",
                            "placeOfBirthCode": "63220",
                            "registrationNumber": "275126322074974",
                            "oid": "1.2.250.1.213.1.4.8"
                        },
                        "json": {
                            "CR": {
                                "CodeCR": "00",
                                "LibelleCR": "OK"
                            },
                            "INDIVIDU": {
                                "INSACTIF": {
                                    "IdIndividu": {
                                        "NumIdentifiant": "2751263220749",
                                        "Cle": "74"
                                    },
                                    "OID": "1.2.250.1.213.1.4.8"
                                },
                                "TIQ": {
                                    "NomNaissance": "ADRUN",
                                    "ListePrenom": "ZOE",
                                    "Sexe": "F",
                                    "DateNaissance": "1975-12-31",
                                    "LieuNaissance": "63220"
                                }
                            }
                        },
                        "xml": (0, xml_request_tester_1.getValidXmlResponseTest)(personDetails),
                        "error": null
                    }
                },
                failedRequests: [],
            });
        }));
        test('should get correct response for Ecetinsi Pierre-Alain', () => __awaiter(void 0, void 0, void 0, function* () {
            const requestId = '7871dedb-2add-47db-8b76-117f8144a840';
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'ECETINSI',
                firstName: 'PIERRE-ALAIN',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '2009-07-14',
            });
            const personDetails = Object.assign(Object.assign({}, person.getPerson()), { registrationNumber: '109076322083489', oid: '1.2.250.1.213.1.4.8', placeOfBirthCode: '63220', allFirstNames: 'PIERRE-ALAIN MURIEL FLORIANT' });
            const insHisto = [
                {
                    "IdIndividu": {
                        "NumIdentifiant": "2090763220834",
                        "Cle": "39",
                        "TypeMatricule": "NIR"
                    },
                    "OID": "1.2.250.1.213.1.4.8"
                },
                {
                    "IdIndividu": {
                        "NumIdentifiant": "2090663220123",
                        "Cle": "55",
                        "TypeMatricule": "NIR"
                    },
                    "OID": "1.2.250.1.213.1.4.8"
                }
            ];
            const fetchInsResult = yield insiClient.fetchIns(person, { requestId, virtualModeEnabled: true });
            expect(fetchInsResult).toEqual({
                successRequest: {
                    "status": "SUCCESS",
                    "request": {
                        "id": expect.any(String),
                        "xml": (0, xml_request_tester_1.getXmlRequestTest)({ idam: env_1.IDAM, version: env_1.SOFTWARE_VERSION, name: env_1.SOFTWARE_NAME, person: person.getPerson(), requestId })
                    },
                    "response": {
                        "formatted": {
                            "birthName": "ECETINSI",
                            "firstName": "PIERRE-ALAIN",
                            "allFirstNames": "PIERRE-ALAIN MURIEL FLORIANT",
                            "gender": "M",
                            "dateOfBirth": "2009-07-14",
                            "placeOfBirthCode": "63220",
                            "registrationNumber": "109076322083489",
                            "oid": "1.2.250.1.213.1.4.8"
                        },
                        "json": {
                            "CR": {
                                "CodeCR": "00",
                                "LibelleCR": "OK"
                            },
                            "INDIVIDU": {
                                "INSACTIF": {
                                    "IdIndividu": {
                                        "NumIdentifiant": "1090763220834",
                                        "Cle": "89"
                                    },
                                    "OID": "1.2.250.1.213.1.4.8"
                                },
                                "INSHISTO": insHisto,
                                "TIQ": {
                                    "NomNaissance": "ECETINSI",
                                    "ListePrenom": "PIERRE-ALAIN MURIEL FLORIANT",
                                    "Sexe": "M",
                                    "DateNaissance": "2009-07-14",
                                    "LieuNaissance": "63220"
                                }
                            }
                        },
                        "xml": (0, xml_request_tester_1.getValidXmlResponseTest)(personDetails, insHisto),
                        "error": null
                    },
                },
                failedRequests: [],
            });
        }));
        test('should get correct response for Herman Gatien', () => __awaiter(void 0, void 0, void 0, function* () {
            const requestId = '7871dedb-2add-47db-8b76-117f8144a840';
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'HERMANN',
                firstName: 'GATIEN',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1981-03-24',
            });
            const personDetails = Object.assign(Object.assign({}, person.getPerson()), { registrationNumber: '181036322045660', oid: '1.2.250.1.213.1.4.8', placeOfBirthCode: '63220', allFirstNames: 'GATIEN' });
            const insHisto = [
                {
                    "IdIndividu": {
                        "NumIdentifiant": "1810363220456",
                        "Cle": "60"
                    },
                    "OID": "1.2.250.1.213.1.4.8"
                },
                {
                    "IdIndividu": {
                        "NumIdentifiant": "2810363220456",
                        "Cle": "10"
                    },
                    "OID": "1.2.250.1.213.1.4.8"
                }
            ];
            const fetchInsResult = yield insiClient.fetchIns(person, { requestId, virtualModeEnabled: true });
            expect(fetchInsResult).toEqual({
                successRequest: {
                    "status": "SUCCESS",
                    "request": {
                        "id": expect.any(String),
                        "xml": (0, xml_request_tester_1.getXmlRequestTest)({ idam: env_1.IDAM, version: env_1.SOFTWARE_VERSION, name: env_1.SOFTWARE_NAME, person: person.getPerson(), requestId })
                    },
                    "response": {
                        "formatted": {
                            "birthName": "HERMANN",
                            "firstName": "GATIEN",
                            "allFirstNames": "GATIEN",
                            "gender": "M",
                            "dateOfBirth": "1981-03-24",
                            "placeOfBirthCode": "63220",
                            "registrationNumber": "181036322045660",
                            "oid": "1.2.250.1.213.1.4.8"
                        },
                        "json": {
                            "CR": {
                                "CodeCR": "00",
                                "LibelleCR": "OK"
                            },
                            "INDIVIDU": {
                                "INSACTIF": {
                                    "IdIndividu": {
                                        "NumIdentifiant": "1810363220456",
                                        "Cle": "60"
                                    },
                                    "OID": "1.2.250.1.213.1.4.8"
                                },
                                "INSHISTO": insHisto,
                                "TIQ": {
                                    "NomNaissance": "HERMANN",
                                    "ListePrenom": "GATIEN",
                                    "Sexe": "M",
                                    "DateNaissance": "1981-03-24",
                                    "LieuNaissance": "63220"
                                }
                            }
                        },
                        "xml": (0, xml_request_tester_1.getValidXmlResponseTest)(personDetails, insHisto),
                        "error": null
                    },
                },
                failedRequests: [],
            });
        }));
        test('should get correct response for NESSI Michelangelo', () => __awaiter(void 0, void 0, void 0, function* () {
            const requestId = '7871dedb-2add-47db-8b76-117f8144a840';
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'NESSI',
                firstName: 'MICHELANGELO',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '2010-08-07',
            });
            const personDetails = Object.assign(Object.assign({}, person.getPerson()), { registrationNumber: '110086322083060', oid: '1.2.250.1.213.1.4.8', placeOfBirthCode: '63220', allFirstNames: 'MICHELANGELO ANTHONY' });
            const fetchInsResult = yield insiClient.fetchIns(person, { requestId, virtualModeEnabled: true });
            expect(fetchInsResult).toEqual({
                successRequest: {
                    "status": "SUCCESS",
                    "request": {
                        "id": expect.any(String),
                        "xml": (0, xml_request_tester_1.getXmlRequestTest)({ idam: env_1.IDAM, version: env_1.SOFTWARE_VERSION, name: env_1.SOFTWARE_NAME, person: person.getPerson(), requestId })
                    },
                    "response": {
                        "formatted": {
                            "birthName": "NESSI",
                            "firstName": "MICHELANGELO",
                            "allFirstNames": "MICHELANGELO ANTHONY",
                            "gender": "M",
                            "dateOfBirth": "2010-08-07",
                            "placeOfBirthCode": "63220",
                            "registrationNumber": "110086322083060",
                            "oid": "1.2.250.1.213.1.4.8"
                        },
                        "json": {
                            "CR": {
                                "CodeCR": "00",
                                "LibelleCR": "OK"
                            },
                            "INDIVIDU": {
                                "INSACTIF": {
                                    "IdIndividu": {
                                        "NumIdentifiant": "1100863220830",
                                        "Cle": "60"
                                    },
                                    "OID": "1.2.250.1.213.1.4.8"
                                },
                                "TIQ": {
                                    "NomNaissance": "NESSI",
                                    "ListePrenom": "MICHELANGELO ANTHONY",
                                    "Sexe": "M",
                                    "DateNaissance": "2010-08-07",
                                    "LieuNaissance": "63220"
                                }
                            }
                        },
                        "xml": (0, xml_request_tester_1.getValidXmlResponseTest)(personDetails),
                        "error": null
                    },
                },
                failedRequests: [],
            });
        }));
        test('should get correct response for Tchitchi ola', () => __awaiter(void 0, void 0, void 0, function* () {
            const requestId = 'b3d188ab-8bc5-4e75-b217-a0ecf58a6953';
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'TCHITCHI',
                firstName: 'OLA CATARINA BELLA',
                gender: insi_person_class_1.Gender.Female,
                dateOfBirth: '1936-06-21',
            });
            const personDetails = Object.assign(Object.assign({}, person.getPerson()), { registrationNumber: '236066322083656', oid: '1.2.250.1.213.1.4.8', placeOfBirthCode: '63220', allFirstNames: 'CATARINA BELLA' });
            const fetchInsResult = yield insiClient.fetchIns(person, { requestId, virtualModeEnabled: true });
            expect(fetchInsResult).toEqual({
                successRequest: {
                    "status": "SUCCESS",
                    "request": {
                        "id": expect.any(String),
                        "xml": (0, xml_request_tester_1.getXmlRequestTest)({ idam: env_1.IDAM, version: env_1.SOFTWARE_VERSION, name: env_1.SOFTWARE_NAME, person: { firstName: 'CATARINA', birthName: 'TCHITCHI', dateOfBirth: '1936-06-21', gender: insi_person_class_1.Gender.Female }, requestId })
                    },
                    "response": {
                        "formatted": {
                            "birthName": "TCHITCHI",
                            "firstName": "CATARINA",
                            "allFirstNames": "CATARINA BELLA",
                            "gender": "F",
                            "dateOfBirth": "1936-06-21",
                            "placeOfBirthCode": "63220",
                            "registrationNumber": "236066322083656",
                            "oid": "1.2.250.1.213.1.4.8"
                        },
                        "json": {
                            "CR": {
                                "CodeCR": "00",
                                "LibelleCR": "OK"
                            },
                            "INDIVIDU": {
                                "INSACTIF": {
                                    "IdIndividu": {
                                        "NumIdentifiant": "2360663220836",
                                        "Cle": "56"
                                    },
                                    "OID": "1.2.250.1.213.1.4.8"
                                },
                                "TIQ": {
                                    "NomNaissance": "TCHITCHI",
                                    "ListePrenom": "CATARINA BELLA",
                                    "Sexe": "F",
                                    "DateNaissance": "1936-06-21",
                                    "LieuNaissance": "63220"
                                }
                            }
                        },
                        "xml": (0, xml_request_tester_1.getValidXmlResponseTest)(personDetails),
                        "error": null
                    }
                },
                failedRequests: [{
                        "status": "SUCCESS",
                        "request": {
                            "id": expect.any(String),
                            "xml": (0, xml_request_tester_1.getXmlRequestTest)({ idam: env_1.IDAM, version: env_1.SOFTWARE_VERSION, name: env_1.SOFTWARE_NAME, person: { firstName: 'OLA', birthName: 'TCHITCHI', dateOfBirth: '1936-06-21', gender: insi_person_class_1.Gender.Female }, requestId })
                        },
                        "response": {
                            "formatted": null,
                            "json": {
                                "CR": {
                                    "CodeCR": "01",
                                    "LibelleCR": "Aucune identite trouvee"
                                }
                            },
                            "xml": (0, xml_request_tester_1.getNoIdentityXmlResponseTest)(),
                            "error": null
                        }
                    }],
            });
        }));
        test('should get correct response for CORSE Anthony', () => __awaiter(void 0, void 0, void 0, function* () {
            const requestId = 'b3d188ab-8bc5-4e75-b217-a0ecf58a6953';
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'CORSE',
                firstName: 'ANTHONY',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1980-03-02',
            });
            const personDetails = Object.assign(Object.assign({}, person.getPerson()), { registrationNumber: '180032B02040123', oid: '1.2.250.1.213.1.4.8', placeOfBirthCode: '2B020', allFirstNames: 'ANTHONY' });
            const insHisto = [
                {
                    "IdIndividu": {
                        "NumIdentifiant": "180032B020401",
                        "Cle": "23"
                    },
                    "OID": "1.2.250.1.213.1.4.8"
                }
            ];
            const fetchInsResult = yield insiClient.fetchIns(person, { requestId, virtualModeEnabled: true });
            expect(fetchInsResult).toEqual({
                successRequest: {
                    "status": "SUCCESS",
                    "request": {
                        "id": expect.any(String),
                        "xml": (0, xml_request_tester_1.getXmlRequestTest)({
                            idam: env_1.IDAM,
                            version: env_1.SOFTWARE_VERSION,
                            name: env_1.SOFTWARE_NAME,
                            person: { firstName: 'ANTHONY', birthName: 'CORSE', dateOfBirth: '1980-03-02', gender: insi_person_class_1.Gender.Male }, requestId
                        })
                    },
                    "response": {
                        "formatted": {
                            "birthName": "CORSE",
                            "firstName": "ANTHONY",
                            "allFirstNames": "ANTHONY",
                            "gender": "M",
                            "dateOfBirth": "1980-03-02",
                            "placeOfBirthCode": "2B020",
                            "registrationNumber": "180032B02040123",
                            "oid": "1.2.250.1.213.1.4.8"
                        },
                        "json": {
                            "CR": {
                                "CodeCR": "00",
                                "LibelleCR": "OK"
                            },
                            "INDIVIDU": {
                                "INSACTIF": {
                                    "IdIndividu": {
                                        "NumIdentifiant": "180032B020401",
                                        "Cle": "23"
                                    },
                                    "OID": "1.2.250.1.213.1.4.8"
                                },
                                "INSHISTO": [
                                    {
                                        "IdIndividu": {
                                            "NumIdentifiant": "180032B020401",
                                            "Cle": "23"
                                        },
                                        "OID": "1.2.250.1.213.1.4.8"
                                    }
                                ],
                                "TIQ": {
                                    "NomNaissance": "CORSE",
                                    "ListePrenom": "ANTHONY",
                                    "Sexe": "M",
                                    "DateNaissance": "1980-03-02",
                                    "LieuNaissance": "2B020"
                                }
                            }
                        },
                        "xml": (0, xml_request_tester_1.getValidXmlResponseTest)(personDetails, insHisto),
                        "error": null
                    }
                },
                failedRequests: [],
            });
        }));
        test('should get correct response for Houilles Pierre', () => __awaiter(void 0, void 0, void 0, function* () {
            const requestId = 'b3d188ab-8bc5-4e75-b217-a0ecf58a6953';
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'HOUILLES',
                firstName: 'PIERRE',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1993-01-27',
            });
            const fetchInsResult = yield insiClient.fetchIns(person, { requestId, virtualModeEnabled: true });
            expect(fetchInsResult).toEqual({
                successRequest: null,
                failedRequests: [{
                        "status": "SUCCESS",
                        "request": {
                            "id": expect.any(String),
                            "xml": (0, xml_request_tester_1.getXmlRequestTest)({ idam: env_1.IDAM, version: env_1.SOFTWARE_VERSION, name: env_1.SOFTWARE_NAME, person: { firstName: 'PIERRE', birthName: 'HOUILLES', dateOfBirth: '1993-01-27', gender: insi_person_class_1.Gender.Male }, requestId })
                        },
                        "response": {
                            formatted: null,
                            json: {
                                CR: {
                                    CodeCR: "01",
                                    LibelleCR: "Aucune identite trouvee"
                                }
                            },
                            "xml": (0, xml_request_tester_1.getNoIdentityXmlResponseTest)(),
                            "error": null
                        }
                    }, {
                        "status": "SUCCESS",
                        "request": {
                            "id": expect.any(String),
                            "xml": (0, xml_request_tester_1.getXmlRequestTest)({ idam: env_1.IDAM, version: env_1.SOFTWARE_VERSION, name: env_1.SOFTWARE_NAME, person: { firstName: 'PAUL', birthName: 'HOUILLES', dateOfBirth: '1993-01-27', gender: insi_person_class_1.Gender.Male }, requestId })
                        },
                        "response": {
                            formatted: null,
                            json: {
                                CR: {
                                    CodeCR: "01",
                                    LibelleCR: "Aucune identite trouvee"
                                }
                            },
                            "xml": (0, xml_request_tester_1.getNoIdentityXmlResponseTest)(),
                            "error": null
                        }
                    }, {
                        "status": "SUCCESS",
                        "request": {
                            "id": expect.any(String),
                            "xml": (0, xml_request_tester_1.getXmlRequestTest)({ idam: env_1.IDAM, version: env_1.SOFTWARE_VERSION, name: env_1.SOFTWARE_NAME, person: { firstName: 'JACQUES', birthName: 'HOUILLES', dateOfBirth: '1993-01-27', gender: insi_person_class_1.Gender.Male }, requestId })
                        },
                        "response": {
                            formatted: null,
                            json: {
                                CR: {
                                    CodeCR: "01",
                                    LibelleCR: "Aucune identite trouvee"
                                }
                            },
                            "xml": (0, xml_request_tester_1.getNoIdentityXmlResponseTest)(),
                            "error": null
                        }
                    }, {
                        "status": "SUCCESS",
                        "request": {
                            "id": expect.any(String),
                            "xml": (0, xml_request_tester_1.getXmlRequestTest)({ idam: env_1.IDAM, version: env_1.SOFTWARE_VERSION, name: env_1.SOFTWARE_NAME, person: { firstName: 'PIERRE PAUL JACQUES', birthName: 'HOUILLES', dateOfBirth: '1993-01-27', gender: insi_person_class_1.Gender.Male }, requestId })
                        },
                        "response": {
                            formatted: null,
                            json: {
                                CR: {
                                    CodeCR: "01",
                                    LibelleCR: "Aucune identite trouvee"
                                }
                            },
                            "xml": (0, xml_request_tester_1.getNoIdentityXmlResponseTest)(),
                            "error": null
                        }
                    }],
            });
        }));
    });
});
//# sourceMappingURL=insi-virtual-mode.test.js.map