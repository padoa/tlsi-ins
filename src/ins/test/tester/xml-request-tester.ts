import { INSiPersonArgs } from 'src/ins/class/insi-person.class';

import { INSiServiceFormattedResponse, InsHisto } from 'src/ins/models/insi-fetch-ins.models';

export const getXmlRequestTest = ({ idam, version, name, emitter, person, requestId, date }: { idam: string; version: string; name: string; emitter: string; person: INSiPersonArgs; requestId: string; date: string }): string => {
  return [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  xmlns:tns="http://www.cnamts.fr/webservice" xmlns:insi="http://www.cnamts.fr/ServiceIdentiteCertifiee/v1" xmlns:insi_recsans_ins="http://www.cnamts.fr/INSiRecSans" xmlns:insi_recvit_ins="http://www.cnamts.fr/INSiRecVit" xmlns:insi_resultat_ins="http://www.cnamts.fr/INSiResultat" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:ctxbam="urn:siram:bam:ctxbam" xmlns:ctxlps="urn:siram:lps:ctxlps" xmlns:siram="urn:siram" xmlns:jaxb="http://java.sun.com/xml/ns/jaxb" xmlns:xjc="http://java.sun.com/xml/ns/jaxb/xjc">',
    '<soap:Header>',
    '<ctxbam:ContexteBAM Version="01_02">',
    `<ctxbam:Id>${requestId}</ctxbam:Id>`,
    `<ctxbam:Temps>${date}</ctxbam:Temps>`,
    `<ctxbam:Emetteur>${emitter}</ctxbam:Emetteur>`,
    '<ctxbam:COUVERTURE>',
    '</ctxbam:COUVERTURE>',
    '</ctxbam:ContexteBAM> <ctxlps:ContexteLPS Nature="CTXLPS" Version="01_00">',
    `<ctxlps:Id>${requestId}</ctxlps:Id>`,
    `<ctxlps:Temps>${date}</ctxlps:Temps>`,
    `<ctxlps:Emetteur>${emitter}</ctxlps:Emetteur>`,
    '<ctxlps:LPS>',
    `<ctxlps:IDAM R="4">${idam}</ctxlps:IDAM>`,
    `<ctxlps:Version>${version}</ctxlps:Version>`,
    '<ctxlps:Instance>b3549edd-4ae9-472a-b26f-fd2fb4ef397f</ctxlps:Instance>',
    `<ctxlps:Nom>urn:lps:${name}:${version}</ctxlps:Nom>`,
    '</ctxlps:LPS>',
    '</ctxlps:ContexteLPS> <wsa:Action xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns="http://www.w3.org/2005/08/addressing">urn:ServiceIdentiteCertifiee:1.0.0:rechercherInsAvecTraitsIdentite</wsa:Action> <wsa:MessageID xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns="http://www.w3.org/2005/08/addressing">uuid:b3549edd-4ae9-472a-b26f-fd2fb4ef397f</wsa:MessageID>',
    '',
    '</soap:Header>',
    '<soap:Body>',
    '<insi_recsans_ins:RECSANSVITALE xmlns:insi_recsans_ins="http://www.cnamts.fr/INSiRecSans" xmlns="http://www.cnamts.fr/INSiRecSans">',
    `<insi_recsans_ins:NomNaissance>${person.birthName}</insi_recsans_ins:NomNaissance>`,
    `<insi_recsans_ins:Prenom>${person.firstName}</insi_recsans_ins:Prenom>`,
    `<insi_recsans_ins:Sexe>${person.gender}</insi_recsans_ins:Sexe>`,
    `<insi_recsans_ins:DateNaissance>${person.dateOfBirth}</insi_recsans_ins:DateNaissance>`,
    '</insi_recsans_ins:RECSANSVITALE>',
    '</soap:Body>',
    '</soap:Envelope>',
  ].join('');
};

export const getNoIdentityXmlResponseTest = (): string => {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>\n',
    '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">',
    '<S:Body xmlns:S=\"http://www.w3.org/2003/05/soap-envelope\">',
    '<RESULTAT xmlns:ns3=\"http://www.cnamts.fr/INSiRecVit\" xmlns:ns2=\"http://www.cnamts.fr/INSiRecSans\" xmlns=\"http://www.cnamts.fr/INSiResultat\">',
    '<CR>',
    '<CodeCR>01</CodeCR>',
    '<LibelleCR>Aucune identite trouvee</LibelleCR>',
    '</CR>',
    '</RESULTAT>',
    '</S:Body>',
    '</soap:Envelope>',
  ].join('');
};

const getXmlInsHisto = (insHisto: InsHisto[]): string => {
  return insHisto.map((insHisto: InsHisto) => {
    return [
      '<INSHISTO>',
      '<IdIndividu>',
      `<NumIdentifiant>${insHisto.IdIndividu.NumIdentifiant}</NumIdentifiant>`,
      `<Cle>${insHisto.IdIndividu.Cle}</Cle>`,
      `<TypeMatricule>${insHisto.IdIndividu.TypeMatricule}</TypeMatricule>`,
      '</IdIndividu>',
      `<OID>${insHisto.OID}</OID>`,
      '</INSHISTO>',
    ];
  }).join('');
}

export const getValidXmlResponseTest = (personDetails: INSiServiceFormattedResponse, insHisto: InsHisto[] = []): string => {
  const numIdentifiant = personDetails.registrationNumber?.slice(0, -2);
  const cle = personDetails.registrationNumber?.slice(-2);
  const xmlInsHisto = getXmlInsHisto(insHisto);
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
    `<NumIdentifiant>${numIdentifiant}</NumIdentifiant>`,
    `<Cle>${cle}</Cle>`,
    '</IdIndividu>',
    `<OID>${personDetails.oid}</OID>`,
    '</INSACTIF>',
    xmlInsHisto,
    '<TIQ>',
    `<NomNaissance>${personDetails.birthName}</NomNaissance>`,
    `<ListePrenom>${personDetails.allFirstNames}</ListePrenom>`,
    `<Sexe>${personDetails.gender}</Sexe>`,
    `<DateNaissance>${personDetails.dateOfBirth}</DateNaissance>`,
    `<LieuNaissance>${personDetails.placeOfBirthCode}</LieuNaissance>`,
    '</TIQ>',
    '</INDIVIDU>',
    '</RESULTAT>',
    '</env:Body>',
    '</soap:Envelope>',
  ].join('');
};
