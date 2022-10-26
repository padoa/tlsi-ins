"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPierreAlainFormattedResponse = exports.getPierreAlainRawResponse = exports.getPierreAlainLiveXmlResponse = exports.getPierreAlainXmlResponse = exports.getCNDAValidationXmlRequest = exports.getTchitchiFormattedResponse = exports.getTchitchiRawResponse = exports.getTchitchiXmlResponse = exports.getAdrtroisDominiqueFormattedResponse = exports.getAdrtroisDominiqueRawResponse = exports.getAdrtroisDominiqueXmlRequest = exports.getAdrtroisDominiqueXmlResponse = exports.getCR02XmlResponse = exports.defaultDate = exports.defaultUuid = void 0;
const insi_person_class_1 = require("../class/insi-person.class");
const insi_fetch_ins_models_1 = require("../models/insi-fetch-ins.models");
exports.defaultUuid = '1f7425e2-b913-415c-adaa-785ee1076a70';
exports.defaultDate = '2020-01-01';
const getCR02XmlResponse = () => {
    return [
        '<?xml version="1.0" encoding="UTF-8"?>\n',
        '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">',
        '<env:Body xmlns:S="http://www.w3.org/2003/05/soap-envelope" xmlns:env="http://www.w3.org/2003/05/soap-envelope">',
        '<RESULTAT xmlns="http://www.cnamts.fr/INSiResultat" xmlns:ns0="http://www.cnamts.fr/INSiRecVit" xmlns:ns1="http://www.cnamts.fr/INSiRecSans">',
        '<CR>',
        '<CodeCR>02</CodeCR>',
        '<LibelleCR>Plusieurs identites trouvees</LibelleCR>',
        '</CR>',
        '</RESULTAT>',
        '</env:Body>',
        '</soap:Envelope>',
    ].join('');
};
exports.getCR02XmlResponse = getCR02XmlResponse;
const getAdrtroisDominiqueXmlResponse = () => {
    return [
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
};
exports.getAdrtroisDominiqueXmlResponse = getAdrtroisDominiqueXmlResponse;
const getAdrtroisDominiqueXmlRequest = ({ idam, version, name }) => {
    return [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  xmlns:tns="http://www.cnamts.fr/webservice" xmlns:insi="http://www.cnamts.fr/ServiceIdentiteCertifiee/v1" xmlns:insi_recsans_ins="http://www.cnamts.fr/INSiRecSans" xmlns:insi_recvit_ins="http://www.cnamts.fr/INSiRecVit" xmlns:insi_resultat_ins="http://www.cnamts.fr/INSiResultat" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:ctxbam="urn:siram:bam:ctxbam" xmlns:ctxlps="urn:siram:lps:ctxlps" xmlns:siram="urn:siram" xmlns:jaxb="http://java.sun.com/xml/ns/jaxb" xmlns:xjc="http://java.sun.com/xml/ns/jaxb/xjc">',
        '<soap:Header>',
        '<ctxbam:ContexteBAM Version="01_02">',
        `<ctxbam:Id>${exports.defaultUuid}</ctxbam:Id>`,
        `<ctxbam:Temps>${new Date(exports.defaultDate).toISOString()}</ctxbam:Temps>`,
        '<ctxbam:Emetteur>medecin@yopmail.com</ctxbam:Emetteur>',
        '<ctxbam:COUVERTURE>',
        '</ctxbam:COUVERTURE>',
        '</ctxbam:ContexteBAM> <ctxlps:ContexteLPS Nature="CTXLPS" Version="01_00">',
        `<ctxlps:Id>${exports.defaultUuid}</ctxlps:Id>`,
        `<ctxlps:Temps>${new Date(exports.defaultDate).toISOString()}</ctxlps:Temps>`,
        '<ctxlps:Emetteur>medecin@yopmail.com</ctxlps:Emetteur>',
        '<ctxlps:LPS>',
        `<ctxlps:IDAM R="4">${idam}</ctxlps:IDAM>`,
        `<ctxlps:Version>${version}</ctxlps:Version>`,
        '<ctxlps:Instance>b3549edd-4ae9-472a-b26f-fd2fb4ef397f</ctxlps:Instance>',
        `<ctxlps:Nom>urn:lps:${name}:${version}</ctxlps:Nom>`,
        '</ctxlps:LPS>',
        '</ctxlps:ContexteLPS> <wsa:Action xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns="http://www.w3.org/2005/08/addressing">urn:ServiceIdentiteCertifiee:1.0.0:rechercherInsAvecTraitsIdentite</wsa:Action> <wsa:MessageID xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns="http://www.w3.org/2005/08/addressing">uuid:b3549edd-4ae9-472a-b26f-fd2fb4ef397f</wsa:MessageID>',
        '</soap:Header>',
        '<soap:Body>',
        '<insi_recsans_ins:RECSANSVITALE xmlns:insi_recsans_ins="http://www.cnamts.fr/INSiRecSans" xmlns="http://www.cnamts.fr/INSiRecSans">',
        '<insi_recsans_ins:NomNaissance>ADRTROIS</insi_recsans_ins:NomNaissance>',
        '<insi_recsans_ins:Prenom>DOMINIQUE</insi_recsans_ins:Prenom>',
        '<insi_recsans_ins:Sexe>F</insi_recsans_ins:Sexe>',
        '<insi_recsans_ins:DateNaissance>1997-02-26</insi_recsans_ins:DateNaissance>',
        '</insi_recsans_ins:RECSANSVITALE>',
        '</soap:Body>',
        '</soap:Envelope>',
    ].join('');
};
exports.getAdrtroisDominiqueXmlRequest = getAdrtroisDominiqueXmlRequest;
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
    socialSecurityNumber: '297022A02077878',
    oid: '1.2.250.1.213.1.4.8',
});
exports.getAdrtroisDominiqueFormattedResponse = getAdrtroisDominiqueFormattedResponse;
const getTchitchiXmlResponse = () => {
    return [
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
};
exports.getTchitchiXmlResponse = getTchitchiXmlResponse;
const getTchitchiRawResponse = () => ({
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
exports.getTchitchiRawResponse = getTchitchiRawResponse;
const getTchitchiFormattedResponse = () => ({
    birthName: 'TCHITCHI',
    firstName: 'CATARINA',
    allFirstNames: 'CATARINA BELLA',
    gender: insi_person_class_1.Gender.Female,
    dateOfBirth: '1936-06-21',
    placeOfBirthCode: '63220',
    socialSecurityNumber: '236066322083656',
    oid: '1.2.250.1.213.1.4.8',
});
exports.getTchitchiFormattedResponse = getTchitchiFormattedResponse;
const getCNDAValidationXmlRequest = ({ idam, version, name, birthName, firstName, sexe, dateOfBirth }) => {
    return [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  xmlns:tns="http://www.cnamts.fr/webservice" xmlns:insi="http://www.cnamts.fr/ServiceIdentiteCertifiee/v1" xmlns:insi_recsans_ins="http://www.cnamts.fr/INSiRecSans" xmlns:insi_recvit_ins="http://www.cnamts.fr/INSiRecVit" xmlns:insi_resultat_ins="http://www.cnamts.fr/INSiResultat" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:ctxbam="urn:siram:bam:ctxbam" xmlns:ctxlps="urn:siram:lps:ctxlps" xmlns:siram="urn:siram" xmlns:jaxb="http://java.sun.com/xml/ns/jaxb" xmlns:xjc="http://java.sun.com/xml/ns/jaxb/xjc">',
        '<soap:Header>',
        '<ctxbam:ContexteBAM Version="01_02">',
        `<ctxbam:Id>${exports.defaultUuid}</ctxbam:Id>`,
        `<ctxbam:Temps>${new Date(exports.defaultDate).toISOString()}</ctxbam:Temps>`,
        '<ctxbam:Emetteur>medecin@yopmail.com</ctxbam:Emetteur>',
        '<ctxbam:COUVERTURE>',
        '</ctxbam:COUVERTURE>',
        '</ctxbam:ContexteBAM> <ctxlps:ContexteLPS Nature="CTXLPS" Version="01_00">',
        `<ctxlps:Id>${exports.defaultUuid}</ctxlps:Id>`,
        `<ctxlps:Temps>${new Date(exports.defaultDate).toISOString()}</ctxlps:Temps>`,
        '<ctxlps:Emetteur>medecin@yopmail.com</ctxlps:Emetteur>',
        '<ctxlps:LPS>',
        `<ctxlps:IDAM R="4">${idam}</ctxlps:IDAM>`,
        `<ctxlps:Version>${version}</ctxlps:Version>`,
        '<ctxlps:Instance>b3549edd-4ae9-472a-b26f-fd2fb4ef397f</ctxlps:Instance>',
        `<ctxlps:Nom>urn:lps:${name}:${version}</ctxlps:Nom>`,
        '</ctxlps:LPS>',
        '</ctxlps:ContexteLPS> <wsa:Action xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns="http://www.w3.org/2005/08/addressing">urn:ServiceIdentiteCertifiee:1.0.0:rechercherInsAvecTraitsIdentite</wsa:Action> <wsa:MessageID xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns="http://www.w3.org/2005/08/addressing">uuid:b3549edd-4ae9-472a-b26f-fd2fb4ef397f</wsa:MessageID>',
        '</soap:Header>',
        '<soap:Body>',
        '<insi_recsans_ins:RECSANSVITALE xmlns:insi_recsans_ins="http://www.cnamts.fr/INSiRecSans" xmlns="http://www.cnamts.fr/INSiRecSans">',
        `<insi_recsans_ins:NomNaissance>${birthName}</insi_recsans_ins:NomNaissance>`,
        `<insi_recsans_ins:Prenom>${firstName}</insi_recsans_ins:Prenom>`,
        `<insi_recsans_ins:Sexe>${sexe}</insi_recsans_ins:Sexe>`,
        `<insi_recsans_ins:DateNaissance>${dateOfBirth}</insi_recsans_ins:DateNaissance>`,
        '</insi_recsans_ins:RECSANSVITALE>',
        '</soap:Body>',
        '</soap:Envelope>',
    ].join('');
};
exports.getCNDAValidationXmlRequest = getCNDAValidationXmlRequest;
const getPierreAlainXmlResponse = () => {
    return [
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
};
exports.getPierreAlainXmlResponse = getPierreAlainXmlResponse;
const getPierreAlainLiveXmlResponse = () => {
    return [
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
};
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
    socialSecurityNumber: '109076322083489',
    oid: '1.2.250.1.213.1.4.8',
});
exports.getPierreAlainFormattedResponse = getPierreAlainFormattedResponse;
//# sourceMappingURL=insi-client.fixture.js.map