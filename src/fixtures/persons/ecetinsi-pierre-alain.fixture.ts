import { getCNDAValidationXmlRequest } from '../insi-client.fixture';
import { Gender } from '../../class/insi-person.class';
import {
  CRCodes,
  CRLabels,
  INSiServiceFormattedResponse,
  INSiServiceJsonResponse,
  INSiServiceResponse,
} from '../../models/insi-fetch-ins.models';

const getEcetinsiPierreAlainXmlRequest = (): string => "<?xml version=\"1.0\" encoding=\"utf-8\"?><soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"  xmlns:tns=\"http://www.cnamts.fr/webservice\" xmlns:insi=\"http://www.cnamts.fr/ServiceIdentiteCertifiee/v1\" xmlns:insi_recsans_ins=\"http://www.cnamts.fr/INSiRecSans\" xmlns:insi_recvit_ins=\"http://www.cnamts.fr/INSiRecVit\" xmlns:insi_resultat_ins=\"http://www.cnamts.fr/INSiResultat\" xmlns:wsse=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\" xmlns:ctxbam=\"urn:siram:bam:ctxbam\" xmlns:ctxlps=\"urn:siram:lps:ctxlps\" xmlns:siram=\"urn:siram\" xmlns:jaxb=\"http://java.sun.com/xml/ns/jaxb\" xmlns:xjc=\"http://java.sun.com/xml/ns/jaxb/xjc\"><soap:Header><ctxbam:ContexteBAM Version=\"01_02\"><ctxbam:Id>5722722e-8921-4945-8ab1-977c7400edd9</ctxbam:Id><ctxbam:Temps>2023-09-26T08:54:23.671Z</ctxbam:Temps><ctxbam:Emetteur>10B0152872</ctxbam:Emetteur><ctxbam:COUVERTURE></ctxbam:COUVERTURE></ctxbam:ContexteBAM> <ctxlps:ContexteLPS Nature=\"CTXLPS\" Version=\"01_00\"><ctxlps:Id>178faac1-67dc-4a79-a6c4-a665c7294175</ctxlps:Id><ctxlps:Temps>2023-09-26T08:54:23.671Z</ctxlps:Temps><ctxlps:Emetteur>10B0152872</ctxlps:Emetteur><ctxlps:LPS><ctxlps:IDAM R=\"4\">PDP17NF21DD0</ctxlps:IDAM><ctxlps:Version>2022</ctxlps:Version><ctxlps:Instance>636c9d43-1a19-5b8c-a8b1-ac43227cfe46</ctxlps:Instance><ctxlps:Nom>urn:lps:padoa:2022</ctxlps:Nom></ctxlps:LPS></ctxlps:ContexteLPS> <wsa:Action xmlns:wsa=\"http://www.w3.org/2005/08/addressing\" xmlns=\"http://www.w3.org/2005/08/addressing\">urn:ServiceIdentiteCertifiee:1.0.0:rechercherInsAvecTraitsIdentite</wsa:Action> <wsa:MessageID xmlns:wsa=\"http://www.w3.org/2005/08/addressing\" xmlns=\"http://www.w3.org/2005/08/addressing\">uuid:5237f6ac-a5ee-4505-89fb-d25d9180dafd</wsa:MessageID></soap:Header><soap:Body><insi_recsans_ins:RECSANSVITALE xmlns:insi_recsans_ins=\"http://www.cnamts.fr/INSiRecSans\" xmlns=\"http://www.cnamts.fr/INSiRecSans\"><insi_recsans_ins:NomNaissance>ECETINSI</insi_recsans_ins:NomNaissance><insi_recsans_ins:Prenom>PIERRE-ALAIN</insi_recsans_ins:Prenom><insi_recsans_ins:Sexe>M</insi_recsans_ins:Sexe><insi_recsans_ins:DateNaissance>2009-07-14</insi_recsans_ins:DateNaissance></insi_recsans_ins:RECSANSVITALE></soap:Body></soap:Envelope>";

const getEcetinsiPierreAlainXmlResponse = (): string => "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\"><S:Body xmlns:S=\"http://www.w3.org/2003/05/soap-envelope\"><RESULTAT xmlns:ns3=\"http://www.cnamts.fr/INSiRecVit\" xmlns:ns2=\"http://www.cnamts.fr/INSiRecSans\" xmlns=\"http://www.cnamts.fr/INSiResultat\"><CR><CodeCR>00</CodeCR><LibelleCR>OK</LibelleCR></CR><INDIVIDU><INSACTIF><IdIndividu><NumIdentifiant>1090763220834</NumIdentifiant><Cle>89</Cle></IdIndividu><OID>1.2.250.1.213.1.4.8</OID></INSACTIF><INSHISTO><IdIndividu><NumIdentifiant>2090763220834</NumIdentifiant><Cle>39</Cle><TypeMatricule>NIR</TypeMatricule></IdIndividu><OID>1.2.250.1.213.1.4.8</OID></INSHISTO><INSHISTO><IdIndividu><NumIdentifiant>2090663220123</NumIdentifiant><Cle>55</Cle><TypeMatricule>NIR</TypeMatricule></IdIndividu><OID>1.2.250.1.213.1.4.8</OID></INSHISTO><TIQ><NomNaissance>ECETINSI</NomNaissance><ListePrenom>PIERRE-ALAIN MURIEL FLORIANT</ListePrenom><Sexe>M</Sexe><DateNaissance>2009-07-14</DateNaissance><LieuNaissance>63220</LieuNaissance></TIQ></INDIVIDU></RESULTAT></S:Body></soap:Envelope>";

export const getEcetinsiPierreAlainRawResponse = (): INSiServiceJsonResponse => ({
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
      NomNaissance: 'ECETINSI',
      ListePrenom: 'PIERRE-ALAIN MURIEL FLORIANT',
      Sexe: Gender.Male,
      DateNaissance: '2009-07-14',
      LieuNaissance: '63220',
    },
  },
});

export const getEcetinsiPierreAlainFormattedResponse = (): INSiServiceFormattedResponse => ({
  oid: '1.2.250.1.213.1.4.8',
  gender: Gender.Male,
  birthName: 'ECETINSI',
  firstName: 'PIERRE-ALAIN',
  dateOfBirth: '2009-07-14',
  allFirstNames: 'PIERRE-ALAIN MURIEL FLORIANT',
  placeOfBirthCode: '63220',
  registrationNumber: '109076322083489',
});

export const getEcetinsiPierreAlainResponse = (): INSiServiceResponse => ({
  formatted: getEcetinsiPierreAlainFormattedResponse(),
  json: getEcetinsiPierreAlainRawResponse(),
  xml: getEcetinsiPierreAlainXmlResponse(),
  error: null,
});

export const getEcetinsiMockedResponse = (): any => {
  return [
    {
      status: 'SUCCESS',
      request: { 
        id: "", 
        xml: getEcetinsiPierreAlainXmlRequest() 
      },
      response: getEcetinsiPierreAlainResponse()
    }
  ];
};