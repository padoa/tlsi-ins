"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdrtroisToussaintResponse = exports.getAdrtroisToussaintFormattedResponse = exports.getAdrtroisToussaintRawResponse = exports.getAdrtroisToussaintXmlResponse = exports.getAdrtroisToussaintXmlRequest = void 0;
const insi_client_fixture_1 = require("../insi-client.fixture");
const insi_person_class_1 = require("../../class/insi-person.class");
const insi_fetch_ins_models_1 = require("../../models/insi-fetch-ins.models");
const getAdrtroisToussaintXmlRequest = ({ idam, version, name, assertionPs }) => (0, insi_client_fixture_1.getCNDAValidationXmlRequest)({
    idam,
    version,
    name,
    birthName: 'ADRTROIS',
    firstName: 'TOUSSAINT',
    gender: insi_person_class_1.Gender.Male,
    dateOfBirth: '1960-01-01',
    assertionPs,
});
exports.getAdrtroisToussaintXmlRequest = getAdrtroisToussaintXmlRequest;
const getAdrtroisToussaintXmlResponse = () => [
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
    '<NumIdentifiant>160012B020777</NumIdentifiant>',
    '<Cle>13</Cle>',
    '</IdIndividu>',
    '<OID>1.2.250.1.213.1.4.8</OID>',
    '</INSACTIF>',
    '<TIQ>',
    '<NomNaissance>ADRTROIS</NomNaissance>',
    '<ListePrenom>TOUSSAINT</ListePrenom>',
    '<Sexe>M</Sexe>',
    '<DateNaissance>1960-01-01</DateNaissance>',
    '<LieuNaissance>2B020</LieuNaissance>',
    '</TIQ>',
    '</INDIVIDU>',
    '</RESULTAT>',
    '</env:Body>',
    '</soap:Envelope>',
].join('');
exports.getAdrtroisToussaintXmlResponse = getAdrtroisToussaintXmlResponse;
const getAdrtroisToussaintRawResponse = () => ({
    CR: {
        CodeCR: insi_fetch_ins_models_1.CRCodes.OK,
        LibelleCR: insi_fetch_ins_models_1.CRLabels.OK,
    },
    INDIVIDU: {
        TIQ: {
            Sexe: insi_person_class_1.Gender.Male,
            ListePrenom: 'TOUSSAINT',
            NomNaissance: 'ADRTROIS',
            DateNaissance: '1960-01-01',
            LieuNaissance: '2B020',
        },
        INSACTIF: {
            OID: '1.2.250.1.213.1.4.8',
            IdIndividu: {
                Cle: '13',
                NumIdentifiant: '160012B020777',
            },
        },
    },
});
exports.getAdrtroisToussaintRawResponse = getAdrtroisToussaintRawResponse;
const getAdrtroisToussaintFormattedResponse = () => ({
    oid: '1.2.250.1.213.1.4.8',
    gender: insi_person_class_1.Gender.Male,
    birthName: 'ADRTROIS',
    firstName: 'TOUSSAINT',
    dateOfBirth: '1960-01-01',
    allFirstNames: 'TOUSSAINT',
    placeOfBirthCode: '2B020',
    registrationNumber: '160012B02077713',
});
exports.getAdrtroisToussaintFormattedResponse = getAdrtroisToussaintFormattedResponse;
const getAdrtroisToussaintResponse = () => ({
    formatted: (0, exports.getAdrtroisToussaintFormattedResponse)(),
    json: (0, exports.getAdrtroisToussaintRawResponse)(),
    xml: (0, exports.getAdrtroisToussaintXmlResponse)(),
    error: null,
});
exports.getAdrtroisToussaintResponse = getAdrtroisToussaintResponse;
//# sourceMappingURL=adrtrois-toussaint.fixture.js.map