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
describe('INSi Client', () => {
    const pfx = fs_1.default.readFileSync('certificates/INSI-AUTO/AUTO-certificate.p12');
    let insiClient;
    test('should be able to create a new INSi client without throwing', () => {
        const lps = new lps_class_1.LPS({
            idam: env_1.IDAM,
            version: env_1.SOFTWARE_VERSION,
            name: env_1.SOFTWARE_NAME,
        }, {
            id: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
        });
        const lpsContext = new lps_context_class_1.LpsContext({
            emitter: 'medecin@yopmail.com',
            lps,
        }, {
            id: '1f7425e2-b913-415c-adaa-785ee1076a70',
            dateTime: '2021-07-05T13:58:27.452Z',
        });
        const bamContext = new bam_context_class_1.BamContext({
            emitter: 'medecin@yopmail.com',
        }, {
            id: 'c1a2ff23-fc05-4bd1-b500-1ec7d3178f1c',
            dateTime: '2021-07-05T13:58:27.452Z',
        });
        insiClient = new insi_client_service_1.INSiClient({
            lpsContext,
            bamContext,
        });
    });
    test('should throw an error if calling fetchInsi without initClient first', () => __awaiter(void 0, void 0, void 0, function* () {
        const person = new insi_person_class_1.INSiPerson({
            birthName: 'ADRTROIS',
            firstName: 'DOMINIQUE',
            gender: insi_person_class_1.Gender.Female,
            dateOfBirth: '1997-02-26',
        });
        yield expect(() => __awaiter(void 0, void 0, void 0, function* () { return insiClient.fetchIns(person); })).rejects.toThrow('fetchIns ERROR: you must init client first');
    }));
    test('should be able to initClient without throwing error', () => __awaiter(void 0, void 0, void 0, function* () {
        yield insiClient.initClientPfx(pfx, env_1.PASSPHRASE);
    }));
    test('should be able to call fetchIns', () => __awaiter(void 0, void 0, void 0, function* () {
        const person = new insi_person_class_1.INSiPerson({
            birthName: 'ADRTROIS',
            firstName: 'DOMINIQUE',
            gender: insi_person_class_1.Gender.Female,
            dateOfBirth: '1997-02-26',
        });
        const { requestId, body, rawBody, bodyAsXMl, requestBodyAsXML, } = yield insiClient.fetchIns(person, {
            requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
        });
        expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
        expect(body).toEqual((0, insi_client_fixture_1.getAdrtroisDominiqueFormattedResponse)());
        expect(rawBody).toEqual((0, insi_client_fixture_1.getAdrtroisDominiqueRawResponse)());
        expect(bodyAsXMl).toEqual((0, insi_client_fixture_1.getAdrtroisDominiqueXmlResponse)());
        expect(requestBodyAsXML).toEqual((0, insi_client_fixture_1.getAdrtroisDominiqueXmlRequest)({
            idam: env_1.IDAM,
            version: env_1.SOFTWARE_VERSION,
            name: env_1.SOFTWARE_NAME,
        }));
    }));
    test('should respond with CR02 code when multiple identities are found', () => __awaiter(void 0, void 0, void 0, function* () {
        const person = new insi_person_class_1.INSiPerson({
            birthName: 'DE VINCI',
            firstName: 'LEONARDO',
            gender: insi_person_class_1.Gender.Male,
            dateOfBirth: '2014-02-01',
        });
        const { requestId, body, rawBody, bodyAsXMl, requestBodyAsXML, } = yield insiClient.fetchIns(person, {
            requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
        });
        expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
        expect(body).toEqual(null);
        expect(rawBody).toEqual({
            CR: {
                CodeCR: insi_fetch_ins_models_1.CRCodes.MULTIPLE_MATCHES,
                LibelleCR: insi_fetch_ins_models_1.CRLabels.MULTIPLE_MATCHES,
            }
        });
        expect(bodyAsXMl).toEqual((0, insi_client_fixture_1.getCR02XmlResponse)());
    }));
    test('should be able to call fetchIns with multiple names even if the first name fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const person = new insi_person_class_1.INSiPerson({
            birthName: 'TCHITCHI',
            firstName: 'OLA CATARINA BELLA',
            gender: insi_person_class_1.Gender.Female,
            dateOfBirth: '1936-06-21',
        });
        const { requestId, body, rawBody, bodyAsXMl, requestBodyAsXML, } = yield insiClient.fetchIns(person, {
            requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
        });
        expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
        expect(body).toEqual((0, insi_client_fixture_1.getTchitchiFormattedResponse)());
        expect(rawBody).toEqual((0, insi_client_fixture_1.getTchitchiRawResponse)());
        expect(bodyAsXMl).toEqual((0, insi_client_fixture_1.getTchitchiXmlResponse)());
        expect(requestBodyAsXML).toEqual((0, insi_fetch_ins_models_1.getCR01XmlRequest)({
            idam: env_1.IDAM,
            version: env_1.SOFTWARE_VERSION,
            name: env_1.SOFTWARE_NAME,
            birthName: 'TCHITCHI',
            firstName: 'CATARINA',
            sexe: insi_person_class_1.Gender.Female,
            dateOfBirth: '1936-06-21',
        }));
    }));
    test('should be able to record failed attempts if the first name fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const person = new insi_person_class_1.INSiPerson({
            birthName: 'TCHITCHI',
            firstName: 'OLA CATARINA BELLA',
            gender: insi_person_class_1.Gender.Female,
            dateOfBirth: '1936-06-21',
        });
        const failedInsRequests = (yield insiClient.fetchIns(person, {
            requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
        })).failedRequests;
        const { requestId, body, rawBody, bodyAsXMl, requestBodyAsXML, } = failedInsRequests[0];
        const expectedResponseAsXML = fs_1.default.readFileSync('src/fixtures/REP_CR01.xml', 'utf-8');
        expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
        expect(body).toEqual(null);
        expect(rawBody).toEqual({
            CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' },
        });
        expect(bodyAsXMl).toEqual(expectedResponseAsXML);
        expect(requestBodyAsXML).toEqual((0, insi_fetch_ins_models_1.getCR01XmlRequest)({
            idam: env_1.IDAM,
            version: env_1.SOFTWARE_VERSION,
            name: env_1.SOFTWARE_NAME,
            birthName: 'TCHITCHI',
            firstName: 'OLA',
            sexe: insi_person_class_1.Gender.Female,
            dateOfBirth: '1936-06-21',
        }));
    }));
    test('should attempt all first names separately and all together at the end', () => __awaiter(void 0, void 0, void 0, function* () {
        const person = new insi_person_class_1.INSiPerson({
            birthName: 'HOUILLES',
            firstName: 'PIERRE PAUL JACQUES',
            gender: insi_person_class_1.Gender.Male,
            dateOfBirth: '1993-01-27',
        });
        const failedInsRequests = (yield insiClient.fetchIns(person, {
            requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
        })).failedRequests;
        const defaultExpectedResponseForHouilles = {
            idam: env_1.IDAM,
            version: env_1.SOFTWARE_VERSION,
            name: env_1.SOFTWARE_NAME,
            birthName: 'HOUILLES',
            sexe: insi_person_class_1.Gender.Male,
            dateOfBirth: '1993-01-27',
        };
        expect(failedInsRequests[0].rawBody).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' } });
        expect(failedInsRequests[0].requestBodyAsXML).toEqual((0, insi_fetch_ins_models_1.getCR01XmlRequest)(Object.assign(Object.assign({}, defaultExpectedResponseForHouilles), { firstName: 'PIERRE' })));
        expect(failedInsRequests[1].rawBody).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' } });
        expect(failedInsRequests[1].requestBodyAsXML).toEqual((0, insi_fetch_ins_models_1.getCR01XmlRequest)(Object.assign(Object.assign({}, defaultExpectedResponseForHouilles), { firstName: 'PAUL' })));
        expect(failedInsRequests[2].rawBody).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' } });
        expect(failedInsRequests[2].requestBodyAsXML).toEqual((0, insi_fetch_ins_models_1.getCR01XmlRequest)(Object.assign(Object.assign({}, defaultExpectedResponseForHouilles), { firstName: 'JACQUES' })));
        expect(failedInsRequests[3].rawBody).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' } });
        expect(failedInsRequests[3].requestBodyAsXML).toEqual((0, insi_fetch_ins_models_1.getCR01XmlRequest)(Object.assign(Object.assign({}, defaultExpectedResponseForHouilles), { firstName: 'PIERRE PAUL JACQUES' })));
    }));
    test('should throw an INSi error if the person does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const person = new insi_person_class_1.INSiPerson({
            birthName: 'ADRTROIS-DOES-NOT-EXIST',
            firstName: 'DOMINIQUE',
            gender: insi_person_class_1.Gender.Female,
            dateOfBirth: '1997-02-26',
        });
        yield expect(() => __awaiter(void 0, void 0, void 0, function* () { return insiClient.fetchIns(person); })).rejects.toThrow('L\'appel au service de recherche avec la carte vitale renvoie une erreur technique.');
    }));
    test('should respond with a CR01 code when the person is in the CR01 special case', () => __awaiter(void 0, void 0, void 0, function* () {
        const person = new insi_person_class_1.INSiPerson({
            birthName: 'TCHITCHI',
            firstName: 'OLA',
            gender: insi_person_class_1.Gender.Female,
            dateOfBirth: '1936-06-21',
        });
        const { requestId, body, rawBody, bodyAsXMl, requestBodyAsXML, } = yield insiClient.fetchIns(person, {
            requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
        });
        const expectedResponseAsXML = fs_1.default.readFileSync('src/fixtures/REP_CR01.xml', 'utf-8');
        expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
        expect(body).toEqual(null);
        expect(rawBody).toEqual({
            CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' },
        });
        expect(bodyAsXMl).toEqual(expectedResponseAsXML);
        expect(requestBodyAsXML).toEqual((0, insi_fetch_ins_models_1.getCR01XmlRequest)({
            idam: env_1.IDAM,
            version: env_1.SOFTWARE_VERSION,
            name: env_1.SOFTWARE_NAME,
            birthName: 'TCHITCHI',
            firstName: 'OLA',
            sexe: insi_person_class_1.Gender.Female,
            dateOfBirth: '1936-06-21',
        }));
    }));
    test('should throw an INSi error if the pfx is not a correct pfx file', () => __awaiter(void 0, void 0, void 0, function* () {
        const lps = new lps_class_1.LPS({
            idam: env_1.IDAM,
            version: env_1.SOFTWARE_VERSION,
            name: env_1.SOFTWARE_NAME,
        });
        const lpsContext = new lps_context_class_1.LpsContext({ emitter: 'medecin@yopmail.com', lps });
        const bamContext = new bam_context_class_1.BamContext({ emitter: 'medecin@yopmail.com' });
        insiClient = new insi_client_service_1.INSiClient({ lpsContext, bamContext, });
        const fakePfx = fs_1.default.readFileSync('certificates/INSI-AUTO/AUTO-certificate-fake.p12');
        yield insiClient.initClientPfx(fakePfx, env_1.PASSPHRASE);
        const person = new insi_person_class_1.INSiPerson({
            birthName: 'ADRTROIS',
            firstName: 'DOMINIQUE',
            gender: insi_person_class_1.Gender.Female,
            dateOfBirth: '1997-02-26',
        });
        yield expect(() => __awaiter(void 0, void 0, void 0, function* () { return insiClient.fetchIns(person); })).rejects.toThrow('Le fichier pfx fourni n\'est pas un fichier pfx valid');
    }));
    test('should throw an INSi error if the Passe phrase is not a correct', () => __awaiter(void 0, void 0, void 0, function* () {
        const lps = new lps_class_1.LPS({
            idam: env_1.IDAM,
            version: env_1.SOFTWARE_VERSION,
            name: env_1.SOFTWARE_NAME,
        });
        const lpsContext = new lps_context_class_1.LpsContext({ emitter: 'medecin@yopmail.com', lps });
        const bamContext = new bam_context_class_1.BamContext({ emitter: 'medecin@yopmail.com' });
        insiClient = new insi_client_service_1.INSiClient({ lpsContext, bamContext, });
        yield insiClient.initClientPfx(pfx, 'fake-pass-phrase');
        const person = new insi_person_class_1.INSiPerson({
            birthName: 'ADRTROIS',
            firstName: 'DOMINIQUE',
            gender: insi_person_class_1.Gender.Female,
            dateOfBirth: '1997-02-26',
        });
        yield expect(() => __awaiter(void 0, void 0, void 0, function* () { return insiClient.fetchIns(person); })).rejects.toThrow('La passe phrase n\'est pas correct');
    }));
    test('should throw an INSi error if the software is not allowed', () => __awaiter(void 0, void 0, void 0, function* () {
        const lps = new lps_class_1.LPS({
            idam: 'FAKE-IDAM',
            version: env_1.SOFTWARE_VERSION,
            name: env_1.SOFTWARE_NAME,
        });
        const lpsContext = new lps_context_class_1.LpsContext({ emitter: 'medecin@yopmail.com', lps });
        const bamContext = new bam_context_class_1.BamContext({ emitter: 'medecin@yopmail.com' });
        insiClient = new insi_client_service_1.INSiClient({ lpsContext, bamContext, });
        yield insiClient.initClientPfx(pfx, env_1.PASSPHRASE);
        const person = new insi_person_class_1.INSiPerson({
            birthName: 'ADRTROIS',
            firstName: 'DOMINIQUE',
            gender: insi_person_class_1.Gender.Female,
            dateOfBirth: '1997-02-26',
        });
        yield expect(() => __awaiter(void 0, void 0, void 0, function* () { return insiClient.fetchIns(person); })).rejects.toThrow('Numéro d\'autorisation du logiciel inconnu.');
    }));
});
//# sourceMappingURL=insi-client.test.js.map