"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTchitchiCatarinaResponse = exports.getTchitchiCatarinaFormattedResponse = exports.getTchitchiCatarinaJsonResponse = exports.getTchitchiCatarinaXmlResponse = exports.getTchitchiCatarinaXmlRequest = exports.getTchitchiOlaXmlRequest = void 0;
const insi_fetch_ins_models_1 = require("../../models/insi-fetch-ins.models");
const insi_person_class_1 = require("../../class/insi-person.class");
const insi_client_fixture_1 = require("../insi-client.fixture");
const getTchitchiOlaXmlRequest = ({ idam, version, name }) => (0, insi_client_fixture_1.getCNDAValidationXmlRequest)({
    idam,
    version,
    name,
    birthName: 'TCHITCHI',
    firstName: 'OLA',
    sexe: insi_person_class_1.Gender.Female,
    dateOfBirth: '1936-06-21',
});
exports.getTchitchiOlaXmlRequest = getTchitchiOlaXmlRequest;
const getTchitchiCatarinaXmlRequest = ({ idam, version, name }) => (0, insi_client_fixture_1.getCNDAValidationXmlRequest)({
    idam,
    version,
    name,
    birthName: 'TCHITCHI',
    firstName: 'CATARINA',
    sexe: insi_person_class_1.Gender.Female,
    dateOfBirth: '1936-06-21',
});
exports.getTchitchiCatarinaXmlRequest = getTchitchiCatarinaXmlRequest;
const getTchitchiCatarinaXmlResponse = () => [
    '<?xml version="1.0" encoding="UTF-8"?>\n',
    '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">',
    '<env:Body xmlns:S="http://www.w3.org/2003/05/soap-envelope" xmlns:env="http://www.w3.org/2003/05/soap-envelope">',
    '<RESULTAT xmlns="http://www.cnamts.fr/INSiResultat" xmlns:ns0="http://www.cnamts.fr/INSiRecVit" xmlns:ns1="http://www.cnamts.fr/INSiRecSans">',
    '<CR>',
    '<CodeCR>00</CodeCR>',
    '<LibelleCR>OK</LibelleCR>',
    '</CR>',
    '<INDIVIDU>',
    '<INSACTIF>',
    '<IdIndividu>',
    '<NumIdentifiant>2360663220836</NumIdentifiant>',
    '<Cle>56</Cle>',
    '</IdIndividu>',
    '<OID>1.2.250.1.213.1.4.8</OID>',
    '</INSACTIF>',
    '<TIQ>',
    '<NomNaissance>TCHITCHI</NomNaissance>',
    '<ListePrenom>CATARINA BELLA</ListePrenom>',
    '<Sexe>F</Sexe>',
    '<DateNaissance>1936-06-21</DateNaissance>',
    '<LieuNaissance>63220</LieuNaissance>',
    '</TIQ>',
    '</INDIVIDU>',
    '</RESULTAT>',
    '</env:Body>',
    '</soap:Envelope>',
].join('');
exports.getTchitchiCatarinaXmlResponse = getTchitchiCatarinaXmlResponse;
const getTchitchiCatarinaJsonResponse = () => ({
    CR: {
        CodeCR: insi_fetch_ins_models_1.CRCodes.OK,
        LibelleCR: insi_fetch_ins_models_1.CRLabels.OK,
    },
    INDIVIDU: {
        INSACTIF: {
            IdIndividu: {
                NumIdentifiant: '2360663220836',
                Cle: '56'
            },
            OID: '1.2.250.1.213.1.4.8'
        },
        TIQ: {
            NomNaissance: 'TCHITCHI',
            ListePrenom: 'CATARINA BELLA',
            Sexe: insi_person_class_1.Gender.Female,
            DateNaissance: '1936-06-21',
            LieuNaissance: '63220'
        }
    }
});
exports.getTchitchiCatarinaJsonResponse = getTchitchiCatarinaJsonResponse;
const getTchitchiCatarinaFormattedResponse = () => ({
    birthName: 'TCHITCHI',
    firstName: 'CATARINA',
    allFirstNames: 'CATARINA BELLA',
    gender: insi_person_class_1.Gender.Female,
    dateOfBirth: '1936-06-21',
    placeOfBirthCode: '63220',
    socialSecurityNumber: '236066322083656',
    oid: '1.2.250.1.213.1.4.8',
});
exports.getTchitchiCatarinaFormattedResponse = getTchitchiCatarinaFormattedResponse;
const getTchitchiCatarinaResponse = () => ({
    formatted: (0, exports.getTchitchiCatarinaFormattedResponse)(),
    json: (0, exports.getTchitchiCatarinaJsonResponse)(),
    xml: (0, exports.getTchitchiCatarinaXmlResponse)(),
    error: null,
});
exports.getTchitchiCatarinaResponse = getTchitchiCatarinaResponse;
//# sourceMappingURL=tchitchi-ola-catarina.fixture.js.map