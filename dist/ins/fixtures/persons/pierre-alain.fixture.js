"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPierreAlainFormattedResponse = exports.getPierreAlainRawResponse = exports.getPierreAlainLiveXmlResponse = exports.getPierreAlainXmlResponse = exports.getPierreAlainXmlRequest = void 0;
const insi_fetch_ins_models_1 = require("../../models/insi-fetch-ins.models");
const insi_person_class_1 = require("../../class/insi-person.class");
const insi_client_fixture_1 = require("../insi-client.fixture");
const getPierreAlainXmlRequest = ({ idam, version, name }) => (0, insi_client_fixture_1.getCNDAValidationXmlRequest)({
    idam,
    version,
    name,
    birthName: 'ECETINSI',
    firstName: 'PIERRE-ALAIN',
    gender: insi_person_class_1.Gender.Male,
    dateOfBirth: '2009-07-14',
});
exports.getPierreAlainXmlRequest = getPierreAlainXmlRequest;
const getPierreAlainXmlResponse = () => [
    '<?xml version="1.0" encoding="UTF-8"?>\n',
    '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">',
    '<S:Body xmlns:S="http://www.w3.org/2003/05/soap-envelope">',
    '<RESULTAT xmlns:ns3="http://www.cnamts.fr/INSiRecVit" xmlns:ns2="http://www.cnamts.fr/INSiRecSans" xmlns="http://www.cnamts.fr/INSiResultat">',
    '<CR>',
    '<CodeCR>00</CodeCR>',
    '<LibelleCR>OK</LibelleCR>',
    '</CR>',
    '<INDIVIDU>',
    '<INSACTIF>',
    '<IdIndividu>',
    '<NumIdentifiant>1090763220834</NumIdentifiant>',
    '<Cle>89</Cle>',
    '</IdIndividu>',
    '<OID>1.2.250.1.213.1.4.8</OID>',
    '</INSACTIF>',
    '<INSHISTO>',
    '<DateDeb>2019-03-01</DateDeb>',
    '<DateFin>2019-02-28</DateFin>',
    '<IdIndividu>',
    '<NumIdentifiant>2090763220834</NumIdentifiant>',
    '<Cle>39</Cle>',
    '</IdIndividu>',
    '<OID>1.2.250.1.213.1.4.8</OID>',
    '</INSHISTO>',
    '<INSHISTO>',
    '<IdIndividu>',
    '<NumIdentifiant>2090663220123</NumIdentifiant>',
    '<Cle>55</Cle>',
    '</IdIndividu>',
    '<OID>1.2.250.1.213.1.4.8</OID>',
    '</INSHISTO>',
    '<TIQ>',
    '<NomNaissance>ECETINSI</NomNaissance>',
    '<ListePrenom>PIERRE-ALAIN MURIEL FLORIANT</ListePrenom>',
    '<Sexe>M</Sexe>',
    '<DateNaissance>2009-07-14</DateNaissance>',
    '<LieuNaissance>63220</LieuNaissance>',
    '</TIQ>',
    '</INDIVIDU>',
    '</RESULTAT>',
    '</S:Body>',
    '</soap:Envelope>',
].join('');
exports.getPierreAlainXmlResponse = getPierreAlainXmlResponse;
const getPierreAlainLiveXmlResponse = () => [
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
    '<NumIdentifiant>1090763220834</NumIdentifiant>',
    '<Cle>89</Cle>',
    '</IdIndividu>',
    '<OID>1.2.250.1.213.1.4.8</OID>',
    '</INSACTIF>',
    '<INSHISTO>',
    '<IdIndividu>',
    '<NumIdentifiant>2090763220834</NumIdentifiant>',
    '<Cle>39</Cle>',
    '</IdIndividu>',
    '<OID>1.2.250.1.213.1.4.8</OID>',
    '<DateDeb>2019-03-01</DateDeb>',
    '<DateFin>2019-02-28</DateFin>',
    '</INSHISTO>',
    '<TIQ>',
    '<NomNaissance>ECETINSI</NomNaissance>',
    '<ListePrenom>PIERRE-ALAIN MURIEL FLORIANT</ListePrenom>',
    '<Sexe>M</Sexe>',
    '<DateNaissance>2009-07-14</DateNaissance>',
    '<LieuNaissance>63220</LieuNaissance>',
    '</TIQ>',
    '</INDIVIDU>',
    '</RESULTAT>',
    '</env:Body>',
    '</soap:Envelope>',
].join('');
exports.getPierreAlainLiveXmlResponse = getPierreAlainLiveXmlResponse;
const getPierreAlainRawResponse = ({ liveVersion = false } = {}) => ({
    CR: {
        CodeCR: insi_fetch_ins_models_1.CRCodes.OK,
        LibelleCR: insi_fetch_ins_models_1.CRLabels.OK,
    },
    INDIVIDU: {
        INSACTIF: {
            IdIndividu: {
                NumIdentifiant: '1090763220834',
                Cle: '89'
            },
            OID: '1.2.250.1.213.1.4.8'
        },
        INSHISTO: [
            {
                DateDeb: "2019-03-01",
                DateFin: "2019-02-28",
                IdIndividu: {
                    Cle: '39',
                    NumIdentifiant: '2090763220834',
                },
                OID: '1.2.250.1.213.1.4.8',
            },
            ...(liveVersion ? [] : [{
                    IdIndividu: {
                        Cle: '55',
                        NumIdentifiant: '2090663220123',
                    },
                    OID: '1.2.250.1.213.1.4.8',
                }]),
        ],
        TIQ: {
            NomNaissance: 'ECETINSI',
            ListePrenom: 'PIERRE-ALAIN MURIEL FLORIANT',
            Sexe: insi_person_class_1.Gender.Male,
            DateNaissance: '2009-07-14',
            LieuNaissance: '63220'
        }
    }
});
exports.getPierreAlainRawResponse = getPierreAlainRawResponse;
const getPierreAlainFormattedResponse = () => ({
    birthName: 'ECETINSI',
    firstName: 'PIERRE-ALAIN',
    allFirstNames: 'PIERRE-ALAIN MURIEL FLORIANT',
    gender: insi_person_class_1.Gender.Male,
    dateOfBirth: '2009-07-14',
    placeOfBirthCode: '63220',
    registrationNumber: '109076322083489',
    oid: '1.2.250.1.213.1.4.8',
});
exports.getPierreAlainFormattedResponse = getPierreAlainFormattedResponse;
//# sourceMappingURL=pierre-alain.fixture.js.map