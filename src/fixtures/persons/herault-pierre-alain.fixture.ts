import { getCNDAValidationXmlRequest } from '../insi-client.fixture';
import { Gender } from '../../class/insi-person.class';
import {
  CRCodes,
  CRLabels,
  INSiServiceFormattedResponse,
  INSiServiceJsonResponse,
  INSiServiceResponse,
} from '../../models/insi-fetch-ins.models';

export const getHeraultPierreAlainXmlRequest = (): string => "<?xml version=\"1.0\" encoding=\"utf-8\"?><soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"  xmlns:tns=\"http://www.cnamts.fr/webservice\" xmlns:insi=\"http://www.cnamts.fr/ServiceIdentiteCertifiee/v1\" xmlns:insi_recsans_ins=\"http://www.cnamts.fr/INSiRecSans\" xmlns:insi_recvit_ins=\"http://www.cnamts.fr/INSiRecVit\" xmlns:insi_resultat_ins=\"http://www.cnamts.fr/INSiResultat\" xmlns:wsse=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\" xmlns:ctxbam=\"urn:siram:bam:ctxbam\" xmlns:ctxlps=\"urn:siram:lps:ctxlps\" xmlns:siram=\"urn:siram\" xmlns:jaxb=\"http://java.sun.com/xml/ns/jaxb\" xmlns:xjc=\"http://java.sun.com/xml/ns/jaxb/xjc\"><soap:Header><ctxbam:ContexteBAM Version=\"01_02\"><ctxbam:Id>ff64321f-f73d-4874-92e0-d0a7c25b37ef</ctxbam:Id><ctxbam:Temps>2023-09-26T08:52:02.578Z</ctxbam:Temps><ctxbam:Emetteur>10B0152872</ctxbam:Emetteur><ctxbam:COUVERTURE></ctxbam:COUVERTURE></ctxbam:ContexteBAM> <ctxlps:ContexteLPS Nature=\"CTXLPS\" Version=\"01_00\"><ctxlps:Id>909a6ebf-fbc5-4492-9d60-d938b77d3697</ctxlps:Id><ctxlps:Temps>2023-09-26T08:52:02.578Z</ctxlps:Temps><ctxlps:Emetteur>10B0152872</ctxlps:Emetteur><ctxlps:LPS><ctxlps:IDAM R=\"4\">PDP17NF21DD0</ctxlps:IDAM><ctxlps:Version>2022</ctxlps:Version><ctxlps:Instance>636c9d43-1a19-5b8c-a8b1-ac43227cfe46</ctxlps:Instance><ctxlps:Nom>urn:lps:padoa:2022</ctxlps:Nom></ctxlps:LPS></ctxlps:ContexteLPS> <wsa:Action xmlns:wsa=\"http://www.w3.org/2005/08/addressing\" xmlns=\"http://www.w3.org/2005/08/addressing\">urn:ServiceIdentiteCertifiee:1.0.0:rechercherInsAvecTraitsIdentite</wsa:Action> <wsa:MessageID xmlns:wsa=\"http://www.w3.org/2005/08/addressing\" xmlns=\"http://www.w3.org/2005/08/addressing\">uuid:32739a42-8bbf-4db5-8686-935d87eddb35</wsa:MessageID></soap:Header><soap:Body><insi_recsans_ins:RECSANSVITALE xmlns:insi_recsans_ins=\"http://www.cnamts.fr/INSiRecSans\" xmlns=\"http://www.cnamts.fr/INSiRecSans\"><insi_recsans_ins:NomNaissance>D&apos;ARTAGNAN DE L&apos;HERAULT</insi_recsans_ins:NomNaissance><insi_recsans_ins:Prenom>PIERRE-ALAIN</insi_recsans_ins:Prenom><insi_recsans_ins:Sexe>M</insi_recsans_ins:Sexe><insi_recsans_ins:DateNaissance>2001-06-17</insi_recsans_ins:DateNaissance></insi_recsans_ins:RECSANSVITALE></soap:Body></soap:Envelope>";

export const getHeraultPierreAlainXmlResponse = (): string => [
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
  '<NumIdentifiant>101066322075460</NumIdentifiant>',
  '<Cle>13</Cle>',
  '</IdIndividu>',
  '<OID>1.2.250.1.213.1.4.8</OID>',
  '</INSACTIF>',
  '<TIQ>',
  '<NomNaissance>D\'ARTAGNAN DE L\'HERAULT</NomNaissance>',
  '<ListePrenom>PIERRE-ALAIN MURIEL FLORIANT</ListePrenom>',
  '<Sexe>M</Sexe>',
  '<DateNaissance>2001-06-17</DateNaissance>',
  '<LieuNaissance>63220</LieuNaissance>',
  '</TIQ>',
  '</INDIVIDU>',
  '</RESULTAT>',
  '</env:Body>',
  '</soap:Envelope>',
].join('');

export const getHeraultPierreAlainRawResponse = (): INSiServiceJsonResponse => ({
  CR: {
    CodeCR: CRCodes.OK,
    LibelleCR: CRLabels.OK,
  },
  INDIVIDU: {
    INSACTIF: {
      OID: '1.2.250.1.213.1.4.8',
      IdIndividu: {
        Cle: '89',
        NumIdentifiant: '1090763220834',
      },
    },
    INSHISTO: [
      {
          IdIndividu: {
              NumIdentifiant: "2090763220834",
              Cle: "39",
              TypeMatricule: "NIR"
          },
          OID: "1.2.250.1.213.1.4.8"
      },
      {
        IdIndividu: {
            NumIdentifiant: "2090663220123",
            Cle: "55",
            TypeMatricule: "NIR"
        },
        OID: "1.2.250.1.213.1.4.8"
      }
    ],
    TIQ: {
      NomNaissance: "ECETINSI",
      ListePrenom: 'PIERRE-ALAIN MURIEL FLORIANT',
      Sexe: Gender.Male,
      DateNaissance: '2009-07-14',
      LieuNaissance: '63220',
    },
  },
});

export const getHeraultPierreAlainFormattedResponse = (): INSiServiceFormattedResponse => ({
  oid: '1.2.250.1.213.1.4.8',
  gender: Gender.Male,
  birthName: "ECETINSI",
  firstName: 'PIERRE-ALAIN',
  allFirstNames: 'PIERRE-ALAIN MURIEL FLORIANT',
  dateOfBirth: '2009-07-14',
  placeOfBirthCode: '63220',
  registrationNumber: '109076322083489',
});

export const getHeraultPierreAlainResponse = (): INSiServiceResponse => ({
  formatted: getHeraultPierreAlainFormattedResponse(),
  json: getHeraultPierreAlainRawResponse(),
  xml: getHeraultPierreAlainXmlResponse(),
  error: null,
});

export const getHeraultMockedResponse = (): any => {
  return [
    {
      status: 'SUCCESS',
      request: {
        id: "",
        xml: getHeraultPierreAlainXmlRequest()
      },
      response: getHeraultPierreAlainResponse()
    }
  ];
};