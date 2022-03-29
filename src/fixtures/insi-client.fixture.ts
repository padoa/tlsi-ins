import { Gender } from '../class/insi-person.class';
import { CRCodes, CRLabels, FetchInsBody, FetchInsRawBody } from '../models/insi-fetch-ins.models';

export const getCR02XmlResponse = (): string => {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>\n',
    '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">',
    '<env:Body xmlns:S="http://www.w3.org/2003/05/soap-envelope" xmlns:env="http://www.w3.org/2003/05/soap-envelope">',
    '<ns2:RESULTAT xmlns:ns3="http://www.cnamts.fr/INSiRecVit" xmlns:ns2="http://www.cnamts.fr/INSiResultat" xmlns="http://www.cnamts.fr/INSiRecSans">',
    '<ns2:CR>',
    '<ns2:CodeCR>02</ns2:CodeCR>',
    '<ns2:LibelleCR>Plusieurs identites trouvees</ns2:LibelleCR>',
    '</ns2:CR>',
    '</ns2:RESULTAT>',
    '</env:Body>',
    '</soap:Envelope>',
  ].join('');
}

export const getAdrtroisDominiqueXmlResponse = ():string => {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>\n',
    '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">',
    '<env:Body xmlns:S="http://www.w3.org/2003/05/soap-envelope" xmlns:env="http://www.w3.org/2003/05/soap-envelope">',
    '<ns2:RESULTAT xmlns:ns3="http://www.cnamts.fr/INSiRecVit" xmlns:ns2="http://www.cnamts.fr/INSiResultat" xmlns="http://www.cnamts.fr/INSiRecSans">',
    '<ns2:CR>',
    '<ns2:CodeCR>00</ns2:CodeCR>',
    '<ns2:LibelleCR>OK</ns2:LibelleCR>',
    '</ns2:CR>',
    '<ns2:INDIVIDU>',
    '<ns2:INSACTIF>',
    '<ns2:IdIndividu>',
    '<ns2:NumIdentifiant>297022A020778</ns2:NumIdentifiant>',
    '<ns2:Cle>78</ns2:Cle>',
    '</ns2:IdIndividu>',
    '<ns2:OID>1.2.250.1.213.1.4.8</ns2:OID>',
    '</ns2:INSACTIF>',
    '<ns2:TIQ>',
    '<ns2:NomNaissance>ADRTROIS</ns2:NomNaissance>',
    '<ns2:Prenom>DOMINIQUE</ns2:Prenom>',
    '<ns2:ListePrenom>DOMINIQUE</ns2:ListePrenom>',
    '<ns2:Sexe>F</ns2:Sexe>',
    '<ns2:DateNaissance>1997-02-26</ns2:DateNaissance>',
    '<ns2:LieuNaissance>20020</ns2:LieuNaissance>',
    '</ns2:TIQ>',
    '</ns2:INDIVIDU>',
    '</ns2:RESULTAT>',
    '</env:Body>',
    '</soap:Envelope>',
  ].join('');
}


export const getAdrtroisDominiqueXmlRequest = (
  { idam, version, name }: { idam: string, version: string, name: string },
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
    '<insi_recsans_ins:NomNaissance>ADRTROIS</insi_recsans_ins:NomNaissance>',
    '<insi_recsans_ins:Prenom>DOMINIQUE</insi_recsans_ins:Prenom>',
    '<insi_recsans_ins:Sexe>F</insi_recsans_ins:Sexe>',
    '<insi_recsans_ins:DateNaissance>1997-02-26</insi_recsans_ins:DateNaissance>',
    '</insi_recsans_ins:RECSANSVITALE>',
    '</soap:Body>',
    '</soap:Envelope>',
  ].join('');
}

export const getAdrtroisDominiqueRawResponse = (): FetchInsRawBody => ({
  CR: {
    CodeCR: CRCodes.OK,
    LibelleCR: CRLabels.OK,
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
      Prenom: 'DOMINIQUE',
      ListePrenom: 'DOMINIQUE',
      Sexe: Gender.Female,
      DateNaissance: '1997-02-26',
      LieuNaissance: '20020'
    }
  }
});

export const getAdrtroisDominiqueFormattedResponse = (): FetchInsBody => ({
  birthName: 'ADRTROIS',
  firstName: 'DOMINIQUE',
  allFirstNames: 'DOMINIQUE',
  gender: Gender.Female,
  dateOfBirth: '1997-02-26',
  placeOfBirthCode: '20020',
  socialSecurityNumber: '297022A02077878',
  oid: '1.2.250.1.213.1.4.8',
});

export const getTchitchiXmlResponse = ():string => {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>\n',
    '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">',
    '<env:Body xmlns:S="http://www.w3.org/2003/05/soap-envelope" xmlns:env="http://www.w3.org/2003/05/soap-envelope">',
    '<ns2:RESULTAT xmlns:ns3="http://www.cnamts.fr/INSiRecVit" xmlns:ns2="http://www.cnamts.fr/INSiResultat" xmlns="http://www.cnamts.fr/INSiRecSans">',
    '<ns2:CR>',
    '<ns2:CodeCR>00</ns2:CodeCR>',
    '<ns2:LibelleCR>OK</ns2:LibelleCR>',
    '</ns2:CR>',
    '<ns2:INDIVIDU>',
    '<ns2:INSACTIF>',
    '<ns2:IdIndividu>',
    '<ns2:NumIdentifiant>2360663220836</ns2:NumIdentifiant>',
    '<ns2:Cle>56</ns2:Cle>',
    '</ns2:IdIndividu>',
    '<ns2:OID>1.2.250.1.213.1.4.8</ns2:OID>',
    '</ns2:INSACTIF>',
    '<ns2:TIQ>',
    '<ns2:NomNaissance>TCHITCHI</ns2:NomNaissance>',
    '<ns2:Prenom>CATARINA</ns2:Prenom>',
    '<ns2:ListePrenom>CATARINA BELLA</ns2:ListePrenom>',
    '<ns2:Sexe>F</ns2:Sexe>',
    '<ns2:DateNaissance>1936-06-21</ns2:DateNaissance>',
    '<ns2:LieuNaissance>63220</ns2:LieuNaissance>',
    '</ns2:TIQ>',
    '</ns2:INDIVIDU>',
    '</ns2:RESULTAT>',
    '</env:Body>',
    '</soap:Envelope>',
  ].join('');
}

export const getTchitchiRawResponse = (): FetchInsRawBody => ({
  CR: {
    CodeCR: CRCodes.OK,
    LibelleCR: CRLabels.OK,
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
      Prenom: 'CATARINA',
      ListePrenom: 'CATARINA BELLA',
      Sexe: Gender.Female,
      DateNaissance: '1936-06-21',
      LieuNaissance: '63220'
    }
  }
});

export const getTchitchiFormattedResponse = (): FetchInsBody => ({
  birthName: 'TCHITCHI',
  firstName: 'CATARINA',
  allFirstNames: 'CATARINA BELLA',
  gender: Gender.Female,
  dateOfBirth: '1936-06-21',
  placeOfBirthCode: '63220',
  socialSecurityNumber: '236066322083656',
  oid: '1.2.250.1.213.1.4.8',
});
