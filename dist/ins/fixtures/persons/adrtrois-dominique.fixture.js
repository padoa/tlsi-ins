"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdrtroisDominiqueResponse = exports.getAdrtroisDominiqueFormattedResponse = exports.getAdrtroisDominiqueRawResponse = exports.getAdrtroisDominiqueXmlResponse = exports.getAdrtroisDominiqueXmlRequest = void 0;
const insi_fetch_ins_models_1 = require("../../models/insi-fetch-ins.models");
const insi_person_class_1 = require("../../class/insi-person.class");
const insi_client_fixture_1 = require("../insi-client.fixture");
const getAdrtroisDominiqueXmlRequest = ({ idam, version, name }) => (0, insi_client_fixture_1.getCNDAValidationXmlRequest)({
    idam,
    version,
    name,
    birthName: 'ADRTROIS',
    firstName: 'DOMINIQUE',
    gender: insi_person_class_1.Gender.Female,
    dateOfBirth: '1997-02-26',
});
exports.getAdrtroisDominiqueXmlRequest = getAdrtroisDominiqueXmlRequest;
const getAdrtroisDominiqueXmlResponse = () => [
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
    '<NumIdentifiant>297022A020778</NumIdentifiant>',
    '<Cle>78</Cle>',
    '</IdIndividu>',
    '<OID>1.2.250.1.213.1.4.8</OID>',
    '</INSACTIF>',
    '<TIQ>',
    '<NomNaissance>ADRTROIS</NomNaissance>',
    '<ListePrenom>DOMINIQUE</ListePrenom>',
    '<Sexe>F</Sexe>',
    '<DateNaissance>1997-02-26</DateNaissance>',
    '<LieuNaissance>2A020</LieuNaissance>',
    '</TIQ>',
    '</INDIVIDU>',
    '</RESULTAT>',
    '</env:Body>',
    '</soap:Envelope>',
].join('');
exports.getAdrtroisDominiqueXmlResponse = getAdrtroisDominiqueXmlResponse;
const getAdrtroisDominiqueRawResponse = () => ({
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
});
exports.getAdrtroisDominiqueRawResponse = getAdrtroisDominiqueRawResponse;
const getAdrtroisDominiqueFormattedResponse = () => ({
    birthName: 'ADRTROIS',
    firstName: 'DOMINIQUE',
    allFirstNames: 'DOMINIQUE',
    gender: insi_person_class_1.Gender.Female,
    dateOfBirth: '1997-02-26',
    placeOfBirthCode: '2A020',
    registrationNumber: '297022A02077878',
    oid: '1.2.250.1.213.1.4.8',
});
exports.getAdrtroisDominiqueFormattedResponse = getAdrtroisDominiqueFormattedResponse;
const getAdrtroisDominiqueResponse = () => ({
    formatted: (0, exports.getAdrtroisDominiqueFormattedResponse)(),
    json: (0, exports.getAdrtroisDominiqueRawResponse)(),
    xml: (0, exports.getAdrtroisDominiqueXmlResponse)(),
    error: null,
});
exports.getAdrtroisDominiqueResponse = getAdrtroisDominiqueResponse;
//# sourceMappingURL=adrtrois-dominique.fixture.js.map