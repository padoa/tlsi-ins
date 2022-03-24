import { Gender } from '../class/insi-person.class';

export interface INSiFetchInsResponse {
  requestId: string;
  body: FetchInsBody | null;
  rawBody: FetchInsRawBody;
  bodyAsXMl: string;
  requestBodyAsXML: string;
}

export interface FetchInsRawBody {
  CR: {
    CodeCR: '00',
    LibelleCR: 'OK'
  },
  INDIVIDU: {
    INSACTIF: {
      IdIndividu: {
        NumIdentifiant: string;
        Cle: string;
      },
      OID: string;
    },
    TIQ: {
      NomNaissance: string;
      Prenom: string;
      ListePrenom: string;
      Sexe: Gender;
      DateNaissance: string; // YYYY-MM-DD
      LieuNaissance: string;
    };
  }
}

export interface FetchInsBody {
  birthName: string;
  firstName: string;
  allFirstNames: string;
  gender: Gender;
  // Date of birth of the subject as YYYY-MM-DD (ex: 1997-02-26)
  dateOfBirth: string;
  placeOfBirthCode: string;
  socialSecurityNumber: string;
  oid: string;
}

export const CR01_STAGING_ENV_CASES = [
  'TCHITCHI',
  'HOUILLES',
];

export const getCR01XmlRequest = (
  { idam, version, name, birthName, firstName, sexe, dateOfBirth }: { idam: string, version: string, name: string, birthName: string, firstName: string, sexe: Gender, dateOfBirth: string },
): string => {
  return [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  xmlns:tns="http://www.cnamts.fr/webservice" xmlns:insi="http://www.cnamts.fr/ServiceIdentiteCertifiee/v1" xmlns:insi_recsans_ins="http://www.cnamts.fr/INSiRecSans" xmlns:insi_recvit_ins="http://www.cnamts.fr/INSiRecVit" xmlns:insi_resultat_ins="http://www.cnamts.fr/INSiResultat" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:ctxbam="urn:siram:bam:ctxbam" xmlns:ctxlps="urn:siram:lps:ctxlps" xmlns:siram="urn:siram" xmlns:jaxb="http://java.sun.com/xml/ns/jaxb" xmlns:xjc="http://java.sun.com/xml/ns/jaxb/xjc">',
    '<soap:Header>',
    '<ctxbam:ContexteBAM Version="01_02">',
    '<ctxbam:Id>c1a2ff23-fc05-4bd1-b500-1ec7d3178f1c</ctxbam:Id>',
    '<ctxbam:Temps>2021-07-05T13:58:27.452Z</ctxbam:Temps>',
    '<ctxbam:Emetteur>medecin@yopmail.com</ctxbam:Emetteur>',
    '<ctxbam:COUVERTURE>',
    '</ctxbam:COUVERTURE>',
    '</ctxbam:ContexteBAM> <ctxlps:ContexteLPS Nature="CTXLPS" Version="01_00">',
    '<ctxlps:Id>1f7425e2-b913-415c-adaa-785ee1076a70</ctxlps:Id>',
    '<ctxlps:Temps>2021-07-05T13:58:27.452Z</ctxlps:Temps>',
    '<ctxlps:Emetteur>medecin@yopmail.com</ctxlps:Emetteur>',
    '<ctxlps:LPS>',
    `<ctxlps:IDAM R="4">${idam}</ctxlps:IDAM>`,
    `<ctxlps:Version>${version}</ctxlps:Version>`,
    '<ctxlps:Instance>b3549edd-4ae9-472a-b26f-fd2fb4ef397f</ctxlps:Instance>',
    `<ctxlps:Nom>${name}</ctxlps:Nom>`,
    '</ctxlps:LPS>',
    '</ctxlps:ContexteLPS> <wsa:Action xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns="http://www.w3.org/2005/08/addressing">urn:ServiceIdentiteCertifiee:1.0.0:rechercherInsAvecTraitsIdentite</wsa:Action> <wsa:MessageID xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns="http://www.w3.org/2005/08/addressing">b3549edd-4ae9-472a-b26f-fd2fb4ef397f</wsa:MessageID>',
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
}
