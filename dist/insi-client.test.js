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
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'ADRTROIS',
                firstName: 'DOMINIQUE',
                gender: insi_person_class_1.Gender.Female,
                dateOfBirth: '1997-02-26',
            });
            const [{ status, requestId, response, responseBodyAsJson, responseBodyAsXml, requestBodyAsXML, }] = yield insiClient.fetchIns(person, {
                requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
            });
            expect(status).toEqual(insi_fetch_ins_models_1.INSiServiceRequestStatus.SUCCESS);
            expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
            expect(response).toEqual((0, insi_client_fixture_1.getAdrtroisDominiqueFormattedResponse)());
            expect(responseBodyAsJson).toEqual((0, insi_client_fixture_1.getAdrtroisDominiqueRawResponse)());
            expect(responseBodyAsXml).toEqual((0, insi_client_fixture_1.getAdrtroisDominiqueXmlResponse)());
            expect(requestBodyAsXML).toEqual((0, insi_client_fixture_1.getAdrtroisDominiqueXmlRequest)({
                idam: env_1.IDAM,
                version: env_1.SOFTWARE_VERSION,
                name: env_1.SOFTWARE_NAME,
            }));
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
            const lps = new lps_class_1.LPS({
                idam: 'FAKE-IDAM',
                version: env_1.SOFTWARE_VERSION,
                name: env_1.SOFTWARE_NAME,
                id: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
            });
            const lpsContext = new lps_context_class_1.LpsContext({ emitter: 'medecin@yopmail.com', lps });
            const bamContext = new bam_context_class_1.BamContext({ emitter: 'medecin@yopmail.com' });
            const client = new insi_client_service_1.INSiClient({ lpsContext, bamContext, });
            yield client.initClientPfx(pfx, env_1.PASSPHRASE);
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'ADRTROIS',
                firstName: 'DOMINIQUE',
                gender: insi_person_class_1.Gender.Female,
                dateOfBirth: '1997-02-26',
            });
            const [{ status, error }] = yield client.fetchIns(person);
            expect(status).toEqual(insi_fetch_ins_models_1.INSiServiceRequestStatus.FAIL);
            expect(error).toEqual({
                siramCode: 'siram_100',
                text: "L'accès par ce progiciel au service n'est pas autorisé. Contactez l'éditeur du progiciel ou votre responsable informatique.",
                desirCode: 'desir_550',
                error: "Numéro d'autorisation du logiciel inconnu."
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
            const [{ status, requestId, response, responseBodyAsJson, responseBodyAsXml, }] = yield insiCpxClient.fetchIns(person, {
                requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
            });
            expect(status).toEqual(insi_fetch_ins_models_1.INSiServiceRequestStatus.SUCCESS);
            expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
            expect(response).toEqual((0, insi_client_fixture_1.getAdrtroisDominiqueFormattedResponse)());
            expect(responseBodyAsJson).toEqual((0, insi_client_fixture_1.getAdrtroisDominiqueRawResponse)());
            expect(responseBodyAsXml).toEqual((0, insi_client_fixture_1.getAdrtroisDominiqueXmlResponse)());
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
            const [{ status, requestId, response, responseBodyAsJson, responseBodyAsXml, }] = yield insiClient.fetchIns(person, {
                requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
            });
            expect(status).toEqual(insi_fetch_ins_models_1.INSiServiceRequestStatus.SUCCESS);
            expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
            expect(response).toEqual(null);
            expect(responseBodyAsJson).toEqual({
                CR: {
                    CodeCR: insi_fetch_ins_models_1.CRCodes.MULTIPLE_MATCHES,
                    LibelleCR: insi_fetch_ins_models_1.CRLabels.MULTIPLE_MATCHES,
                }
            });
            expect(responseBodyAsXml).toEqual((0, insi_client_fixture_1.getCR02XmlResponse)());
        }));
        test('should be able to call fetchIns with multiple names even if the first name fails (OLA CATARINA BELLA)', () => __awaiter(void 0, void 0, void 0, function* () {
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'TCHITCHI',
                firstName: 'OLA CATARINA BELLA',
                gender: insi_person_class_1.Gender.Female,
                dateOfBirth: '1936-06-21',
            });
            const requestId = 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f';
            const [firstResult, secondResult] = yield insiClient.fetchIns(person, { requestId });
            const expectedResponseAsXML = fs_1.default.readFileSync('src/fixtures/REP_CR01.xml', 'utf-8');
            expect(firstResult.status).toEqual(insi_fetch_ins_models_1.INSiServiceRequestStatus.SUCCESS);
            expect(firstResult.requestId).toEqual(requestId);
            expect(firstResult.response).toEqual(null);
            expect(firstResult.responseBodyAsJson).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' } });
            expect(firstResult.responseBodyAsXml).toEqual(expectedResponseAsXML);
            expect(firstResult.requestBodyAsXML).toEqual((0, insi_client_fixture_1.getCNDAValidationXmlRequest)({
                idam: env_1.IDAM,
                version: env_1.SOFTWARE_VERSION,
                name: env_1.SOFTWARE_NAME,
                birthName: 'TCHITCHI',
                firstName: 'OLA',
                sexe: insi_person_class_1.Gender.Female,
                dateOfBirth: '1936-06-21',
            }));
            expect(secondResult.status).toEqual(insi_fetch_ins_models_1.INSiServiceRequestStatus.SUCCESS);
            expect(secondResult.requestId).toEqual(requestId);
            expect(secondResult.response).toEqual((0, insi_client_fixture_1.getTchitchiFormattedResponse)());
            expect(secondResult.responseBodyAsJson).toEqual((0, insi_client_fixture_1.getTchitchiRawResponse)());
            expect(secondResult.responseBodyAsXml).toEqual((0, insi_client_fixture_1.getTchitchiXmlResponse)());
            expect(secondResult.requestBodyAsXML).toEqual((0, insi_client_fixture_1.getCNDAValidationXmlRequest)({
                idam: env_1.IDAM,
                version: env_1.SOFTWARE_VERSION,
                name: env_1.SOFTWARE_NAME,
                birthName: 'TCHITCHI',
                firstName: 'CATARINA',
                sexe: insi_person_class_1.Gender.Female,
                dateOfBirth: '1936-06-21',
            }));
        }));
        test('should attempt all first names separately and all together at the end (PIERRE PAUL JACQUES)', () => __awaiter(void 0, void 0, void 0, function* () {
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'HOUILLES',
                firstName: 'PIERRE PAUL JACQUES',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1993-01-27',
            });
            const requestId = 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f';
            const [pierreResponse, paulResponse, jaquesResponse, allNamesResponse] = yield insiClient.fetchIns(person, { requestId });
            const defaultExpectedResponseForHouilles = {
                idam: env_1.IDAM,
                version: env_1.SOFTWARE_VERSION,
                name: env_1.SOFTWARE_NAME,
                birthName: 'HOUILLES',
                sexe: insi_person_class_1.Gender.Male,
                dateOfBirth: '1993-01-27',
            };
            expect(pierreResponse.status).toEqual(insi_fetch_ins_models_1.INSiServiceRequestStatus.SUCCESS);
            expect(pierreResponse.responseBodyAsJson).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' } });
            expect(pierreResponse.requestBodyAsXML).toEqual((0, insi_client_fixture_1.getCNDAValidationXmlRequest)(Object.assign(Object.assign({}, defaultExpectedResponseForHouilles), { firstName: 'PIERRE' })));
            expect(paulResponse.status).toEqual(insi_fetch_ins_models_1.INSiServiceRequestStatus.SUCCESS);
            expect(paulResponse.responseBodyAsJson).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' } });
            expect(paulResponse.requestBodyAsXML).toEqual((0, insi_client_fixture_1.getCNDAValidationXmlRequest)(Object.assign(Object.assign({}, defaultExpectedResponseForHouilles), { firstName: 'PAUL' })));
            expect(jaquesResponse.status).toEqual(insi_fetch_ins_models_1.INSiServiceRequestStatus.SUCCESS);
            expect(jaquesResponse.responseBodyAsJson).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' } });
            expect(jaquesResponse.requestBodyAsXML).toEqual((0, insi_client_fixture_1.getCNDAValidationXmlRequest)(Object.assign(Object.assign({}, defaultExpectedResponseForHouilles), { firstName: 'JACQUES' })));
            expect(allNamesResponse.status).toEqual(insi_fetch_ins_models_1.INSiServiceRequestStatus.SUCCESS);
            expect(allNamesResponse.responseBodyAsJson).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' } });
            expect(allNamesResponse.requestBodyAsXML).toEqual((0, insi_client_fixture_1.getCNDAValidationXmlRequest)(Object.assign(Object.assign({}, defaultExpectedResponseForHouilles), { firstName: 'PIERRE PAUL JACQUES' })));
        }));
        test('should be able to call fetchIns when its overridden for test_2.04 INSHISTO', () => __awaiter(void 0, void 0, void 0, function* () {
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'ECETINSI',
                firstName: 'PIERRE-ALAIN',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '2009-07-14',
            });
            const [{ requestId, response, responseBodyAsJson, responseBodyAsXml, requestBodyAsXML, }] = yield insiClient.fetchIns(person, {
                requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
            });
            expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
            expect(response).toEqual((0, insi_client_fixture_1.getPierreAlainFormattedResponse)());
            expect(responseBodyAsJson).toEqual((0, insi_client_fixture_1.getPierreAlainRawResponse)());
            expect(responseBodyAsXml).toEqual((0, insi_client_fixture_1.getPierreAlainXmlResponse)());
            expect(requestBodyAsXML).toEqual((0, insi_client_fixture_1.getCNDAValidationXmlRequest)({
                idam: env_1.IDAM,
                version: env_1.SOFTWARE_VERSION,
                name: env_1.SOFTWARE_NAME,
                birthName: 'ECETINSI',
                firstName: 'PIERRE-ALAIN',
                sexe: insi_person_class_1.Gender.Male,
                dateOfBirth: '2009-07-14',
            }));
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
            const [{ requestId, response, responseBodyAsJson, responseBodyAsXml, requestBodyAsXML, }] = yield client.fetchIns(person, { requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f' });
            expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
            expect(response).toEqual((0, insi_client_fixture_1.getPierreAlainFormattedResponse)());
            expect(responseBodyAsJson).toEqual((0, insi_client_fixture_1.getPierreAlainRawResponse)({ liveVersion: true }));
            expect(responseBodyAsXml).toEqual((0, insi_client_fixture_1.getPierreAlainLiveXmlResponse)());
            expect(requestBodyAsXML).toEqual((0, insi_client_fixture_1.getCNDAValidationXmlRequest)({
                idam: env_1.IDAM,
                version: env_1.SOFTWARE_VERSION,
                name: env_1.SOFTWARE_NAME,
                birthName: 'ECETINSI',
                firstName: 'PIERRE-ALAIN',
                sexe: insi_person_class_1.Gender.Male,
                dateOfBirth: '2009-07-14',
            }));
        }));
        test('should throw an INSi error if the person does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const requestId = 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f';
            const person = new insi_person_class_1.INSiPerson({
                birthName: 'ADRTROIS-DOES-NOT-EXIST',
                firstName: 'DOMINIQUE',
                gender: insi_person_class_1.Gender.Female,
                dateOfBirth: '1997-02-26',
            });
            const [response] = yield insiClient.fetchIns(person, { requestId });
            const requestBodyAsXML = (0, insi_client_fixture_1.getCNDAValidationXmlRequest)({
                idam: env_1.IDAM,
                version: env_1.SOFTWARE_VERSION,
                name: env_1.SOFTWARE_NAME,
                birthName: 'ADRTROIS-DOES-NOT-EXIST',
                firstName: 'DOMINIQUE',
                sexe: insi_person_class_1.Gender.Female,
                dateOfBirth: '1997-02-26',
            });
            expect(response).toEqual({
                status: insi_fetch_ins_models_1.INSiServiceRequestStatus.FAIL,
                error: {
                    desirCode: 'insi_102',
                    error: 'L appel au service de recherche avec les traits d identité renvoie une erreur technique.',
                    siramCode: 'siram_40',
                    text: 'Le service est temporairement inaccessible.\nVeuillez renouveler votre demande ultérieurement. Si le problème persiste, contactez l\'éditeur du progiciel ou votre responsable informatique.',
                },
                requestBodyAsXML,
                requestId,
                response: null,
                responseBodyAsJson: null,
                responseBodyAsXml: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\"><env:Body xmlns:S=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:env=\"http://www.w3.org/2003/05/soap-envelope\"><S:Fault xmlns:ns4=\"http://schemas.xmlsoap.org/soap/envelope/\"><S:Code><S:Value>S:Receiver</S:Value><S:Subcode><S:Value>S:siram_40</S:Value></S:Subcode></S:Code><S:Reason><S:Text xml:lang=\"en\">Le service est temporairement inaccessible.\nVeuillez renouveler votre demande ultérieurement. Si le problème persiste, contactez l'éditeur du progiciel ou votre responsable informatique.</S:Text></S:Reason><S:Detail><siram:Erreur severite=\"fatal\" code=\"insi_102\" xmlns:siram=\"urn:siram\">L appel au service de recherche avec les traits d identité renvoie une erreur technique.</siram:Erreur></S:Detail></S:Fault></env:Body></soap:Envelope>",
            });
        }));
    });
});
//# sourceMappingURL=insi-client.test.js.map