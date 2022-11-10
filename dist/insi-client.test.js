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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lps_class_1 = require("./class/lps.class");
const env_1 = require("./models/env");
const lps_context_class_1 = require("./class/lps-context.class");
const bam_context_class_1 = require("./class/bam-context.class");
const insi_client_service_1 = require("./insi-client.service");
const insi_person_class_1 = require("./class/insi-person.class");
const insi_client_fixture_1 = require("./fixtures/insi-client.fixture");
const fs_1 = __importDefault(require("fs"));
const insi_fetch_ins_models_1 = require("./models/insi-fetch-ins.models");
const adrtrois_dominique_fixture_1 = require("./fixtures/persons/adrtrois-dominique.fixture");
const tchitchi_ola_catarina_fixture_1 = require("./fixtures/persons/tchitchi-ola-catarina.fixture");
const de_vinci_leonardo_fixture_1 = require("./fixtures/persons/de-vinci-leonardo.fixture");
const pierre_alain_fixture_1 = require("./fixtures/persons/pierre-alain.fixture");
const siram_100_desir_500_fake_idam_fixtures_1 = require("./fixtures/service-errors/siram_100-desir_500-fake-idam.fixtures");
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
                }
            };
            const name = 'ContexteLPS';
            const namespace = 'ctxlps';
            return { soapHeader, name, namespace };
        },
    })),
}));
const padoaConf = {
    idam: env_1.IDAM,
    version: env_1.SOFTWARE_VERSION,
    name: env_1.SOFTWARE_NAME,
};
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
describe('INSi Client', () => {
    const pfx = fs_1.default.readFileSync('certificates/INSI-AUTO/AUTO-certificate.p12');
    let insiClient;
    describe('Initialisation', () => {
        test('should be able to create a new INSi client without throwing', () => {
            insiClient = getClientWithDefinedId();
        });
        test('should throw an error if calling fetchInsi without initClient first', () => __awaiter(void 0, void 0, void 0, function* () {
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'ADRTROIS',
                firstName: 'DOMINIQUE',
                gender: insi_person_class_1.Gender.Female,
                dateOfBirth: '1997-02-26',
            });
            yield expect(() => __awaiter(void 0, void 0, void 0, function* () { return insiClient.fetchIns(person); })).rejects.toThrow('fetchIns ERROR: you must init client security first');
        }));
        test('should be able to initClient without throwing error', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insiClient.initClientPfx(pfx, env_1.PASSPHRASE);
        }));
    });
    describe('Security: Pfx', () => {
        test('should be able to call fetchIns', () => __awaiter(void 0, void 0, void 0, function* () {
            const requestId = 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f';
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'ADRTROIS',
                firstName: 'DOMINIQUE',
                gender: insi_person_class_1.Gender.Female,
                dateOfBirth: '1997-02-26',
            });
            const fetchInsResult = yield insiClient.fetchIns(person, { requestId });
            expect(fetchInsResult).toEqual({
                successRequest: {
                    status: insi_fetch_ins_models_1.INSiServiceRequestStatus.SUCCESS,
                    request: {
                        id: requestId,
                        xml: (0, adrtrois_dominique_fixture_1.getAdrtroisDominiqueXmlRequest)(padoaConf),
                    },
                    response: (0, adrtrois_dominique_fixture_1.getAdrtroisDominiqueResponse)(),
                },
                failedRequests: [],
            });
        }));
        test('should throw an INSi error if the pfx is not a correct pfx file', () => __awaiter(void 0, void 0, void 0, function* () {
            const client = getClientWithDefinedId();
            const fakePfx = fs_1.default.readFileSync('certificates/INSI-AUTO/AUTO-certificate-fake.p12');
            yield client.initClientPfx(fakePfx, env_1.PASSPHRASE);
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'ADRTROIS',
                firstName: 'DOMINIQUE',
                gender: insi_person_class_1.Gender.Female,
                dateOfBirth: '1997-02-26',
            });
            yield expect(() => __awaiter(void 0, void 0, void 0, function* () { return client.fetchIns(person); })).rejects.toThrow('Le fichier pfx fourni n\'est pas un fichier pfx valid');
        }));
        test('should throw an INSi error if the Passe phrase is not a correct', () => __awaiter(void 0, void 0, void 0, function* () {
            const client = getClientWithDefinedId();
            yield client.initClientPfx(pfx, 'fake-pass-phrase');
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'ADRTROIS',
                firstName: 'DOMINIQUE',
                gender: insi_person_class_1.Gender.Female,
                dateOfBirth: '1997-02-26',
            });
            yield expect(() => __awaiter(void 0, void 0, void 0, function* () { return client.fetchIns(person); })).rejects.toThrow('La passe phrase n\'est pas correct');
        }));
        test('should have a failed request if the software is not allowed', () => __awaiter(void 0, void 0, void 0, function* () {
            const lpsId = 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f';
            const idam = 'FAKE-IDAM';
            const version = env_1.SOFTWARE_VERSION;
            const name = env_1.SOFTWARE_NAME;
            const lps = new lps_class_1.LPS({ idam, version, name, id: lpsId });
            const lpsContext = new lps_context_class_1.LpsContext({ emitter: 'medecin@yopmail.com', lps });
            const bamContext = new bam_context_class_1.BamContext({ emitter: 'medecin@yopmail.com' });
            const client = new insi_client_service_1.INSiClient({ lpsContext, bamContext, });
            yield client.initClientPfx(pfx, env_1.PASSPHRASE);
            const requestId = 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f';
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'ADRTROIS',
                firstName: 'DOMINIQUE',
                gender: insi_person_class_1.Gender.Female,
                dateOfBirth: '1997-02-26',
            });
            const fetchInsResult = yield client.fetchIns(person, { requestId });
            expect(fetchInsResult).toEqual({
                successRequest: null,
                failedRequests: [{
                        status: insi_fetch_ins_models_1.INSiServiceRequestStatus.FAIL,
                        request: {
                            id: requestId,
                            xml: (0, adrtrois_dominique_fixture_1.getAdrtroisDominiqueXmlRequest)({ idam, version, name }),
                        },
                        response: {
                            formatted: null,
                            json: null,
                            xml: siram_100_desir_500_fake_idam_fixtures_1.fakeIdamXmlResponse,
                            error: {
                                siramCode: 'siram_100',
                                text: "L'accès par ce progiciel au service n'est pas autorisé. Contactez l'éditeur du progiciel ou votre responsable informatique.",
                                desirCode: 'desir_550',
                                error: "Numéro d'autorisation du logiciel inconnu.",
                            }
                        },
                    }],
            });
        }));
    });
    describe('Use case and INS-i Errors (PfxSecurity Used)', () => {
        test('should respond with CR02 code when multiple identities are found', () => __awaiter(void 0, void 0, void 0, function* () {
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'DE VINCI',
                firstName: 'LEONARDO',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '2014-02-01',
            });
            const fetchInsResult = yield insiClient.fetchIns(person, {
                requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
            });
            expect(fetchInsResult).toEqual({
                successRequest: null,
                failedRequests: [{
                        status: insi_fetch_ins_models_1.INSiServiceRequestStatus.SUCCESS,
                        request: {
                            id: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
                            xml: (0, de_vinci_leonardo_fixture_1.getDeVinciLeonardoXmlRequest)(padoaConf),
                        },
                        response: {
                            error: null,
                            formatted: null,
                            json: {
                                CR: {
                                    CodeCR: insi_fetch_ins_models_1.CRCodes.MULTIPLE_MATCHES,
                                    LibelleCR: insi_fetch_ins_models_1.CRLabels.MULTIPLE_MATCHES,
                                }
                            },
                            xml: (0, insi_client_fixture_1.getCR02XmlResponse)(),
                        },
                    }],
            });
        }));
        test('should be able to call fetchIns with multiple names even if the first name fails (OLA CATARINA BELLA)', () => __awaiter(void 0, void 0, void 0, function* () {
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'TCHITCHI',
                firstName: 'OLA CATARINA BELLA',
                gender: insi_person_class_1.Gender.Female,
                dateOfBirth: '1936-06-21',
            });
            const requestId = 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f';
            const cr01XmlResponse = fs_1.default.readFileSync('src/fixtures/REP_CR01.xml', 'utf-8');
            const fetchInsResult = yield insiClient.fetchIns(person, { requestId });
            expect(fetchInsResult).toEqual({
                successRequest: {
                    status: insi_fetch_ins_models_1.INSiServiceRequestStatus.SUCCESS,
                    request: {
                        id: requestId,
                        xml: (0, tchitchi_ola_catarina_fixture_1.getTchitchiCatarinaXmlRequest)(padoaConf),
                    },
                    response: (0, tchitchi_ola_catarina_fixture_1.getTchitchiCatarinaResponse)(),
                },
                failedRequests: [{
                        status: insi_fetch_ins_models_1.INSiServiceRequestStatus.SUCCESS,
                        request: {
                            id: requestId,
                            xml: (0, tchitchi_ola_catarina_fixture_1.getTchitchiOlaXmlRequest)(padoaConf),
                        },
                        response: {
                            formatted: null,
                            json: { CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' } },
                            xml: cr01XmlResponse,
                            error: null,
                        }
                    }],
            });
        }));
        test('should attempt all first names separately and all together at the end (PIERRE PAUL JACQUES)', () => __awaiter(void 0, void 0, void 0, function* () {
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'HOUILLES',
                firstName: 'PIERRE PAUL JACQUES',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1993-01-27',
            });
            const requestId = 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f';
            const cr01XmlResponse = fs_1.default.readFileSync('src/fixtures/REP_CR01.xml', 'utf-8');
            const fetchInsResult = yield insiClient.fetchIns(person, { requestId });
            const defaultExpectedResponseForHouilles = {
                idam: env_1.IDAM,
                version: env_1.SOFTWARE_VERSION,
                name: env_1.SOFTWARE_NAME,
                birthName: 'HOUILLES',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1993-01-27',
            };
            const CR01Response = {
                formatted: null,
                json: { CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' } },
                xml: cr01XmlResponse,
                error: null,
            };
            const pierreFetchRequest = {
                status: insi_fetch_ins_models_1.INSiServiceRequestStatus.SUCCESS,
                request: {
                    id: requestId,
                    xml: (0, insi_client_fixture_1.getCNDAValidationXmlRequest)(Object.assign(Object.assign({}, defaultExpectedResponseForHouilles), { firstName: 'PIERRE' }))
                },
                response: CR01Response,
            };
            const paulFetchRequest = {
                status: insi_fetch_ins_models_1.INSiServiceRequestStatus.SUCCESS,
                request: {
                    id: requestId,
                    xml: (0, insi_client_fixture_1.getCNDAValidationXmlRequest)(Object.assign(Object.assign({}, defaultExpectedResponseForHouilles), { firstName: 'PAUL' }))
                },
                response: CR01Response,
            };
            const jaquesFetchRequest = {
                status: insi_fetch_ins_models_1.INSiServiceRequestStatus.SUCCESS,
                request: {
                    id: requestId,
                    xml: (0, insi_client_fixture_1.getCNDAValidationXmlRequest)(Object.assign(Object.assign({}, defaultExpectedResponseForHouilles), { firstName: 'JACQUES' }))
                },
                response: CR01Response,
            };
            const allNamesFetchRequest = {
                status: insi_fetch_ins_models_1.INSiServiceRequestStatus.SUCCESS,
                request: {
                    id: requestId,
                    xml: (0, insi_client_fixture_1.getCNDAValidationXmlRequest)(Object.assign(Object.assign({}, defaultExpectedResponseForHouilles), { firstName: 'PIERRE PAUL JACQUES' }))
                },
                response: CR01Response,
            };
            expect(fetchInsResult).toEqual({
                successRequest: null,
                failedRequests: [pierreFetchRequest, paulFetchRequest, jaquesFetchRequest, allNamesFetchRequest],
            });
        }));
        test('should be able to call fetchIns when its overridden for test_2.04 INSHISTO', () => __awaiter(void 0, void 0, void 0, function* () {
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'ECETINSI',
                firstName: 'PIERRE-ALAIN',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '2009-07-14',
            });
            const fetchInsResult = yield insiClient.fetchIns(person, {
                requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
            });
            expect(fetchInsResult).toEqual({
                successRequest: {
                    status: insi_fetch_ins_models_1.INSiServiceRequestStatus.SUCCESS,
                    request: {
                        id: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
                        xml: (0, pierre_alain_fixture_1.getPierreAlainXmlRequest)(padoaConf),
                    },
                    response: {
                        formatted: (0, pierre_alain_fixture_1.getPierreAlainFormattedResponse)(),
                        json: (0, pierre_alain_fixture_1.getPierreAlainRawResponse)(),
                        xml: (0, pierre_alain_fixture_1.getPierreAlainXmlResponse)(),
                        error: null,
                    },
                },
                failedRequests: [],
            });
        }));
        test('should handle single INSHISTO as an array, test_2.04 LIVE', () => __awaiter(void 0, void 0, void 0, function* () {
            const client = getClientWithDefinedId(false);
            yield client.initClientPfx(pfx, env_1.PASSPHRASE);
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'ECETINSI',
                firstName: 'PIERRE-ALAIN',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '2009-07-14',
            });
            const fetchInsResult = yield client.fetchIns(person, { requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f' });
            expect(fetchInsResult).toEqual({
                successRequest: {
                    status: insi_fetch_ins_models_1.INSiServiceRequestStatus.SUCCESS,
                    request: {
                        id: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
                        xml: (0, pierre_alain_fixture_1.getPierreAlainXmlRequest)(padoaConf),
                    },
                    response: {
                        formatted: (0, pierre_alain_fixture_1.getPierreAlainFormattedResponse)(),
                        json: (0, pierre_alain_fixture_1.getPierreAlainRawResponse)({ liveVersion: true }),
                        xml: (0, pierre_alain_fixture_1.getPierreAlainLiveXmlResponse)(),
                        error: null,
                    },
                },
                failedRequests: [],
            });
        }));
        test('should throw an INSi error if the person does not exist that stop the loop', () => __awaiter(void 0, void 0, void 0, function* () {
            const requestId = 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f';
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'DE VINCI',
                firstName: 'LEONARDO DICAPRIO BUFFALO',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '2014-02-01',
            });
            const fetchInsResult = yield insiClient.fetchIns(person, { requestId });
            const dicaprioDevinciXmlRequest = (0, insi_client_fixture_1.getCNDAValidationXmlRequest)({
                idam: env_1.IDAM,
                version: env_1.SOFTWARE_VERSION,
                name: env_1.SOFTWARE_NAME,
                birthName: 'DE VINCI',
                firstName: 'DICAPRIO',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '2014-02-01',
            });
            expect(fetchInsResult).toEqual({
                successRequest: null,
                failedRequests: [{
                        status: insi_fetch_ins_models_1.INSiServiceRequestStatus.SUCCESS,
                        request: {
                            id: requestId,
                            xml: (0, de_vinci_leonardo_fixture_1.getDeVinciLeonardoXmlRequest)(padoaConf),
                        },
                        response: {
                            error: null,
                            formatted: null,
                            json: {
                                CR: {
                                    CodeCR: insi_fetch_ins_models_1.CRCodes.MULTIPLE_MATCHES,
                                    LibelleCR: insi_fetch_ins_models_1.CRLabels.MULTIPLE_MATCHES,
                                }
                            },
                            xml: (0, insi_client_fixture_1.getCR02XmlResponse)(),
                        },
                    }, {
                        status: insi_fetch_ins_models_1.INSiServiceRequestStatus.FAIL,
                        request: {
                            id: requestId,
                            xml: dicaprioDevinciXmlRequest,
                        },
                        response: {
                            formatted: null,
                            json: null,
                            xml: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\"><env:Body xmlns:S=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:env=\"http://www.w3.org/2003/05/soap-envelope\"><S:Fault xmlns:ns4=\"http://schemas.xmlsoap.org/soap/envelope/\"><S:Code><S:Value>S:Receiver</S:Value><S:Subcode><S:Value>S:siram_40</S:Value></S:Subcode></S:Code><S:Reason><S:Text xml:lang=\"en\">Le service est temporairement inaccessible.\nVeuillez renouveler votre demande ultérieurement. Si le problème persiste, contactez l'éditeur du progiciel ou votre responsable informatique.</S:Text></S:Reason><S:Detail><siram:Erreur severite=\"fatal\" code=\"insi_102\" xmlns:siram=\"urn:siram\">L appel au service de recherche avec les traits d identité renvoie une erreur technique.</siram:Erreur></S:Detail></S:Fault></env:Body></soap:Envelope>",
                            error: {
                                desirCode: 'insi_102',
                                error: 'L appel au service de recherche avec les traits d identité renvoie une erreur technique.',
                                siramCode: 'siram_40',
                                text: 'Le service est temporairement inaccessible.\nVeuillez renouveler votre demande ultérieurement. Si le problème persiste, contactez l\'éditeur du progiciel ou votre responsable informatique.',
                            },
                        },
                    }],
            });
        }));
    });
    /**
     * KEEP IT SKIPPED
     * It cannot be a live test as the assertion expires after 1h
     * You can test it locally by putting a valid assertion
     * */
    describe.skip('Security: Cpx', () => {
        const assertionPs = `PUT ASSERTION HERE`;
        let insiCpxClient;
        test('should create an insiClient with an AssertionPsSecurityClass', () => __awaiter(void 0, void 0, void 0, function* () {
            insiCpxClient = getClientWithDefinedId();
            yield insiCpxClient.initClientCpx(assertionPs);
        }));
        test('should be able to call fetchIns', () => __awaiter(void 0, void 0, void 0, function* () {
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'ADRTROIS',
                firstName: 'DOMINIQUE',
                gender: insi_person_class_1.Gender.Female,
                dateOfBirth: '1997-02-26',
            });
            const { successRequest } = yield insiCpxClient.fetchIns(person, {
                requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
            });
            expect(successRequest === null || successRequest === void 0 ? void 0 : successRequest.status).toEqual(insi_fetch_ins_models_1.INSiServiceRequestStatus.SUCCESS);
            expect(successRequest === null || successRequest === void 0 ? void 0 : successRequest.request.id).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
            expect(successRequest === null || successRequest === void 0 ? void 0 : successRequest.response).toEqual((0, adrtrois_dominique_fixture_1.getAdrtroisDominiqueResponse)());
        }));
    });
});
//# sourceMappingURL=insi-client.test.js.map