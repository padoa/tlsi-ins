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
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const certificates_1 = require("./utils/certificates");
const env_1 = require("./models/env");
const insi_client_service_1 = require("./insi-client.service");
const lps_class_1 = require("./class/lps.class");
const lps_context_class_1 = require("./class/lps-context.class");
const bam_context_class_1 = require("./class/bam-context.class");
const insi_person_class_1 = require("./class/insi-person.class");
const tryouts_fixtures_1 = require("./tryouts.fixtures");
describe('Convert CA cert to PEM', () => {
    // Make sure we are compatible with Windows line endings
    const ACI_EL_ORG_PEM_CERTIFICATE = fs_1.default.readFileSync('src/fixtures/ACI_EL_ORG_PEM_CERTIFICATE.pem.fixture', 'utf-8').replace(/\n/g, '\r\n');
    const ACR_EL_PEM_CERTIFICATE = fs_1.default.readFileSync('src/fixtures/ACR_EL_PEM_CERTIFICATE.pem.fixture', 'utf-8').replace(/\n/g, '\r\n');
    test('convert a single file', () => {
        const pem = (0, certificates_1.readCertAsPem)('certificates/ca/ACI-EL-ORG.cer');
        expect(pem).toStrictEqual(ACI_EL_ORG_PEM_CERTIFICATE);
    });
    test('convert multiple files and concat', () => {
        const certChain = (0, certificates_1.combineCertAsPem)([
            'certificates/ca/ACI-EL-ORG.cer',
            'certificates/ca/ACR-EL.cer',
        ]);
        const expected = [
            ACI_EL_ORG_PEM_CERTIFICATE,
            ACR_EL_PEM_CERTIFICATE,
        ].join('');
        expect(certChain).toEqual(expected);
    });
});
const pfx = fs_1.default.readFileSync('certificates/INSI-AUTO/AUTO-certificate.p12');
describe('INSi client', () => {
    let lps;
    let insiClient;
    describe('LPS class', () => {
        test('should be able to create an LPS and get his header as json', () => {
            lps = new lps_class_1.LPS({
                idam: 'GDF1TNF51DK9',
                version: '2022',
                name: 'docto-solution',
            }, {
                id: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
            });
            expect(lps.getSoapHeaderAsJson()).toEqual({
                IDAM: {
                    attributes: { R: 4 },
                    $value: 'GDF1TNF51DK9',
                },
                Version: '2022',
                Instance: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
                Nom: 'docto-solution',
            });
        });
        test('should generate a valid UUID as id', () => {
            const myLps = new lps_class_1.LPS({
                idam: 'GDF1TNF51DK9',
                version: '2022',
                name: 'docto-solution',
            });
            expect((0, uuid_1.validate)(myLps.id));
        });
        test('should not be able to create an LPS if empty IDAM', () => {
            expect(() => {
                new lps_class_1.LPS({
                    idam: '',
                    version: '2022',
                    name: 'docto-solution',
                });
            }).toThrow('Fail to create a LPS, you must provide an idam');
        });
        test('should not be able to create an LPS if empty version', () => {
            expect(() => {
                new lps_class_1.LPS({
                    idam: 'GDF1TNF51DK9',
                    version: '',
                    name: 'docto-solution',
                });
            }).toThrow('Fail to create a LPS, you must provide a version');
        });
        test('should not be able to create an LPS if empty name', () => {
            expect(() => {
                new lps_class_1.LPS({
                    idam: 'GDF1TNF51DK9',
                    version: '2022',
                    name: '',
                });
            }).toThrow('Fail to create a LPS, you must provide a name');
        });
    });
    describe('LPS Context', () => {
        test('should be able to create an LPS Context and get his header as json', () => {
            const lpsContext = new lps_context_class_1.LpsContext({
                emitter: 'medecin@yopmail.com',
                lps,
            }, {
                id: '1f7425e2-b913-415c-adaa-785ee1076a70',
                dateTime: '2021-07-05T13:58:27.452Z',
            });
            const { soapHeader, name, namespace } = lpsContext.getSoapHeaderAsJson();
            expect(name).toEqual('ContexteLPS');
            expect(namespace).toEqual('ctxlps');
            expect(soapHeader).toEqual({
                ContexteLPS: {
                    attributes: {
                        Nature: 'CTXLPS',
                        Version: '01_00',
                    },
                    Id: '1f7425e2-b913-415c-adaa-785ee1076a70',
                    Temps: '2021-07-05T13:58:27.452Z',
                    Emetteur: 'medecin@yopmail.com',
                    LPS: {
                        IDAM: {
                            attributes: { R: 4 },
                            $value: 'GDF1TNF51DK9',
                        },
                        Version: '2022',
                        Instance: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
                        Nom: 'docto-solution',
                    },
                }
            });
        });
        test('should generate a valid UUID as id', () => {
            const myLpsContext = new lps_context_class_1.LpsContext({ emitter: 'medecin@yopmail.com', lps });
            expect((0, uuid_1.validate)(myLpsContext.id));
        });
        test('should generate dateTime in ISO Format', () => {
            const myLpsContext = new lps_context_class_1.LpsContext({ emitter: 'medecin@yopmail.com', lps });
            expect(new Date(myLpsContext.dateTime).toISOString()).toEqual(myLpsContext.dateTime);
        });
        test('should not be able to create an LPS Context if empty emitter', () => {
            expect(() => {
                new lps_context_class_1.LpsContext({ emitter: '', lps });
            }).toThrow('Fail to create a LpsContext, you must provide an emitter');
        });
    });
    describe('BAM Context', () => {
        test('should be able to create a BAM Context and get his header as json', () => {
            const bamContext = new bam_context_class_1.BamContext({
                emitter: 'medecin@yopmail.com',
            }, {
                id: '1f7425e2-b913-415c-adaa-785ee1076a70',
                dateTime: '2021-07-05T13:58:27.452Z',
            });
            const { soapHeader, name, namespace } = bamContext.getSoapHeaderAsJson();
            expect(name).toEqual('ContexteBAM');
            expect(namespace).toEqual('ctxbam');
            expect(soapHeader).toEqual({
                ContexteBAM: {
                    attributes: {
                        Version: '01_02',
                    },
                    Id: '1f7425e2-b913-415c-adaa-785ee1076a70',
                    Temps: '2021-07-05T13:58:27.452Z',
                    Emetteur: 'medecin@yopmail.com',
                    COUVERTURE: {},
                },
            });
        });
        test('should generate a valid UUID as id', () => {
            const myBamContext = new bam_context_class_1.BamContext({ emitter: 'medecin@yopmail.com' });
            expect((0, uuid_1.validate)(myBamContext.id));
        });
        test('should generate dateTime in ISO Format', () => {
            const myBamContext = new bam_context_class_1.BamContext({ emitter: 'medecin@yopmail.com' });
            expect(new Date(myBamContext.dateTime).toISOString()).toEqual(myBamContext.dateTime);
        });
        test('should not be able to create an Bam Context if empty emitter', () => {
            expect(() => {
                new bam_context_class_1.BamContext({ emitter: '' });
            }).toThrow('Fail to create a BamContext, you must provide an emitter');
        });
    });
    describe('INSi Person', () => {
        test('should be able to create an INSi Person and get his data as json', () => {
            const insiPerson = new insi_person_class_1.INSiPerson({
                birthName: 'DAMPIERRE',
                firstName: 'ERIC',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1990-01-01',
                placeOfBirthCode: '2A020',
            });
            expect(insiPerson.getSoapBodyAsJson()).toEqual({
                NomNaissance: 'DAMPIERRE',
                // Prenom: 'ERIC',
                Sexe: insi_person_class_1.Gender.Male,
                DateNaissance: '1990-01-01',
                LieuNaissance: '2A020',
            });
        });
        test('should be able to create an INSi Person without placeOfBirthCode and get his data as json', () => {
            const insiPerson = new insi_person_class_1.INSiPerson({
                birthName: 'DAMPIERRE',
                firstName: 'ERIC',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1990-01-01',
            });
            expect(insiPerson.getSoapBodyAsJson()).toEqual({
                NomNaissance: 'DAMPIERRE',
                // Prenom: 'ERIC',
                Sexe: insi_person_class_1.Gender.Male,
                DateNaissance: '1990-01-01',
            });
        });
        test('should be able to create an INSi Person if birthName contains -', () => {
            const insiPerson = new insi_person_class_1.INSiPerson({
                birthName: 'DAMPI-ERRE',
                firstName: 'ERIC',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1990-01-01',
            });
            expect(insiPerson.getSoapBodyAsJson()).toEqual({
                NomNaissance: 'DAMPI-ERRE',
                // Prenom: 'ERIC',
                Sexe: insi_person_class_1.Gender.Male,
                DateNaissance: '1990-01-01',
            });
        });
        test('should be able to create an INSi Person if birthName contains --', () => {
            const insiPerson = new insi_person_class_1.INSiPerson({
                birthName: 'DAMPI--ERRE',
                firstName: 'ERIC',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1990-01-01',
            });
            expect(insiPerson.getSoapBodyAsJson()).toEqual({
                NomNaissance: 'DAMPI--ERRE',
                // Prenom: 'ERIC',
                Sexe: insi_person_class_1.Gender.Male,
                DateNaissance: '1990-01-01',
            });
        });
        test('should be able to create an INSi Person if birthName contains \'', () => {
            const insiPerson = new insi_person_class_1.INSiPerson({
                birthName: 'D\'AMPIERRE',
                firstName: 'ERIC',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1990-01-01',
            });
            expect(insiPerson.getSoapBodyAsJson()).toEqual({
                NomNaissance: 'D\'AMPIERRE',
                // Prenom: 'ERIC',
                Sexe: insi_person_class_1.Gender.Male,
                DateNaissance: '1990-01-01',
            });
        });
        test('should be able to create an INSi Person if birthName contains blank space', () => {
            const insiPerson = new insi_person_class_1.INSiPerson({
                birthName: 'DAMPI ERRE',
                firstName: 'ERIC',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1990-01-01',
            });
            expect(insiPerson.getSoapBodyAsJson()).toEqual({
                NomNaissance: 'DAMPI ERRE',
                // Prenom: 'ERIC',
                Sexe: insi_person_class_1.Gender.Male,
                DateNaissance: '1990-01-01',
            });
        });
        test('should not be able to create an INSi Person if empty birthName', () => {
            expect(() => {
                new insi_person_class_1.INSiPerson({
                    birthName: '',
                    firstName: 'ERIC',
                    gender: insi_person_class_1.Gender.Male,
                    dateOfBirth: '1990-01-01',
                    placeOfBirthCode: '2A020',
                });
            }).toThrow('Fail to create an INSiPerson, you must provide a birthName');
        });
        test('should not be able to create an INSi Person if birthName contains lowercase letters', () => {
            expect(() => {
                new insi_person_class_1.INSiPerson({
                    birthName: 'Dampierre',
                    firstName: 'ERIC',
                    gender: insi_person_class_1.Gender.Male,
                    dateOfBirth: '1990-01-01',
                    placeOfBirthCode: '2A020',
                });
            }).toThrow('Fail to create an INSiPerson, the birthName you provided is not in the correct format');
        });
        test('should not be able to create an INSi Person if birthName starts with a blank', () => {
            expect(() => {
                new insi_person_class_1.INSiPerson({
                    birthName: ' DAMPIERRE',
                    firstName: 'ERIC',
                    gender: insi_person_class_1.Gender.Male,
                    dateOfBirth: '1990-01-01',
                    placeOfBirthCode: '2A020',
                });
            }).toThrow('Fail to create an INSiPerson, the birthName you provided is not in the correct format');
        });
        test('should not be able to create an INSi Person if birthName contains another character than those found in names', () => {
            expect(() => {
                new insi_person_class_1.INSiPerson({
                    birthName: 'DAMPI_ERRE',
                    firstName: 'ERIC',
                    gender: insi_person_class_1.Gender.Male,
                    dateOfBirth: '1990-01-01',
                    placeOfBirthCode: '2A020',
                });
            }).toThrow('Fail to create an INSiPerson, the birthName you provided is not in the correct format');
        });
        test('should be able to create an INSi Person if firstName contains -', () => {
            const insiPerson = new insi_person_class_1.INSiPerson({
                birthName: 'DAMPIERRE',
                firstName: 'ER-IC',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1990-01-01',
            });
            expect(insiPerson.getSoapBodyAsJson()).toEqual({
                NomNaissance: 'DAMPIERRE',
                // Prenom: 'ER-IC',
                Sexe: insi_person_class_1.Gender.Male,
                DateNaissance: '1990-01-01',
            });
        });
        test('should be able to create an INSi Person if firstName contains --', () => {
            const insiPerson = new insi_person_class_1.INSiPerson({
                birthName: 'DAMPIERRE',
                firstName: 'ER--IC',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1990-01-01',
            });
            expect(insiPerson.getSoapBodyAsJson()).toEqual({
                NomNaissance: 'DAMPIERRE',
                // Prenom: 'ER--IC',
                Sexe: insi_person_class_1.Gender.Male,
                DateNaissance: '1990-01-01',
            });
        });
        test('should be able to create an INSi Person if firstName contains \'', () => {
            const insiPerson = new insi_person_class_1.INSiPerson({
                birthName: 'DAMPIERRE',
                firstName: 'E\'RIC',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1990-01-01',
            });
            expect(insiPerson.getSoapBodyAsJson()).toEqual({
                NomNaissance: 'DAMPIERRE',
                // Prenom: 'E\'RIC',
                Sexe: insi_person_class_1.Gender.Male,
                DateNaissance: '1990-01-01',
            });
        });
        test('should be able to create an INSi Person if firstName contains a blank space', () => {
            const insiPerson = new insi_person_class_1.INSiPerson({
                birthName: 'DAMPIERRE',
                firstName: 'ER IC',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1990-01-01',
            });
            expect(insiPerson.getSoapBodyAsJson()).toEqual({
                NomNaissance: 'DAMPIERRE',
                // Prenom: 'ER IC',
                Sexe: insi_person_class_1.Gender.Male,
                DateNaissance: '1990-01-01',
            });
        });
        test('should not be able to create an INSi Person if empty firstName', () => {
            expect(() => {
                new insi_person_class_1.INSiPerson({
                    birthName: 'DAMPIERRE',
                    firstName: '',
                    gender: insi_person_class_1.Gender.Male,
                    dateOfBirth: '1990-01-01',
                    placeOfBirthCode: '2A020',
                });
            }).toThrow('Fail to create an INSiPerson, you must provide a firstName');
        });
        test('should not be able to create an INSi Person if firstName contains lowercase letters', () => {
            expect(() => {
                new insi_person_class_1.INSiPerson({
                    birthName: 'DAMPIERRE',
                    firstName: 'Eric',
                    gender: insi_person_class_1.Gender.Male,
                    dateOfBirth: '1990-01-01',
                    placeOfBirthCode: '2A020',
                });
            }).toThrow('Fail to create an INSiPerson, the firstName you provided is not in the correct format');
        });
        test('should not be able to create an INSi Person if firstName starts with a blank', () => {
            expect(() => {
                new insi_person_class_1.INSiPerson({
                    birthName: 'DAMPIERRE',
                    firstName: ' ERIC',
                    gender: insi_person_class_1.Gender.Male,
                    dateOfBirth: '1990-01-01',
                    placeOfBirthCode: '2A020',
                });
            }).toThrow('Fail to create an INSiPerson, the firstName you provided is not in the correct format');
        });
        test('should not be able to create an INSi Person if firstName contains another character than those found in names', () => {
            expect(() => {
                new insi_person_class_1.INSiPerson({
                    birthName: 'DAMPIERRE',
                    firstName: 'ER_IC',
                    gender: insi_person_class_1.Gender.Male,
                    dateOfBirth: '1990-01-01',
                    placeOfBirthCode: '2A020',
                });
            }).toThrow('Fail to create an INSiPerson, the firstName you provided is not in the correct format');
        });
        test('should not be able to create an INSi Person if empty dateOfBirth', () => {
            expect(() => {
                new insi_person_class_1.INSiPerson({
                    birthName: 'DAMPIERRE',
                    firstName: 'ERIC',
                    gender: insi_person_class_1.Gender.Male,
                    dateOfBirth: '',
                    placeOfBirthCode: '2A020',
                });
            }).toThrow('Fail to create an INSiPerson, you must provide a valid dateOfBirth');
        });
        test('should not be able to create an INSi Person if dateOfBirth is not valid', () => {
            expect(() => {
                new insi_person_class_1.INSiPerson({
                    birthName: 'DAMPIERRE',
                    firstName: 'ERIC',
                    gender: insi_person_class_1.Gender.Male,
                    dateOfBirth: '2021-56-12',
                    placeOfBirthCode: '2A020',
                });
            }).toThrow('Fail to create an INSiPerson, you must provide a valid dateOfBirth');
        });
    });
    describe('INSi Client', () => {
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
            expect(body).toEqual((0, tryouts_fixtures_1.getAdrtroisDominiqueFormattedResponse)());
            expect(rawBody).toEqual((0, tryouts_fixtures_1.getAdrtroisDominiqueRawResponse)());
            expect(bodyAsXMl).toEqual((0, tryouts_fixtures_1.getAdrtroisDominiqueXmlResponse)());
            expect(requestBodyAsXML).toEqual((0, tryouts_fixtures_1.getAdrtroisDominiqueXmlResquest)({
                idam: env_1.IDAM,
                version: env_1.SOFTWARE_VERSION,
                name: env_1.SOFTWARE_NAME,
            }));
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
});
//# sourceMappingURL=tryouts.test.js.map