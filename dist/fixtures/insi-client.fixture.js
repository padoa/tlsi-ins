"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCNDAValidationXmlRequest = exports.getCR02XmlResponse = exports.defaultDate = exports.defaultUuid = void 0;
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
//# sourceMappingURL=insi-client.fixture.js.map