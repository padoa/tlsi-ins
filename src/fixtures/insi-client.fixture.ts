import { Gender } from '../class/insi-person.class';
import { CRCodes, CRLabels, FetchInsBody, FetchInsRawBody } from '../models/insi-fetch-ins.models';

export const defaultUuid = '1f7425e2-b913-415c-adaa-785ee1076a70';
export const defaultDate = '2020-01-01';

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
    `<ctxbam:Id>${defaultUuid}</ctxbam:Id>`,
    `<ctxbam:Temps>${new Date(defaultDate).toISOString()}</ctxbam:Temps>`,
    '<ctxbam:Emetteur>medecin@yopmail.com</ctxbam:Emetteur>',
    '<ctxbam:COUVERTURE>',
    '</ctxbam:COUVERTURE>',
    '</ctxbam:ContexteBAM> <ctxlps:ContexteLPS Nature="CTXLPS" Version="01_00">',
    `<ctxlps:Id>${defaultUuid}</ctxlps:Id>`,
    `<ctxlps:Temps>${new Date(defaultDate).toISOString()}</ctxlps:Temps>`,
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

export const getCNDAValidationXmlRequest = (
  { idam, version, name, birthName, firstName, sexe, dateOfBirth }: { idam: string, version: string, name: string, birthName: string, firstName: string, sexe: Gender, dateOfBirth: string },
): string => {
  return [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  xmlns:tns="http://www.cnamts.fr/webservice" xmlns:insi="http://www.cnamts.fr/ServiceIdentiteCertifiee/v1" xmlns:insi_recsans_ins="http://www.cnamts.fr/INSiRecSans" xmlns:insi_recvit_ins="http://www.cnamts.fr/INSiRecVit" xmlns:insi_resultat_ins="http://www.cnamts.fr/INSiResultat" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:ctxbam="urn:siram:bam:ctxbam" xmlns:ctxlps="urn:siram:lps:ctxlps" xmlns:siram="urn:siram" xmlns:jaxb="http://java.sun.com/xml/ns/jaxb" xmlns:xjc="http://java.sun.com/xml/ns/jaxb/xjc">',
    '<soap:Header>',
    '<ctxbam:ContexteBAM Version="01_02">',
    `<ctxbam:Id>${defaultUuid}</ctxbam:Id>`,
    `<ctxbam:Temps>${new Date(defaultDate).toISOString()}</ctxbam:Temps>`,
    '<ctxbam:Emetteur>medecin@yopmail.com</ctxbam:Emetteur>',
    '<ctxbam:COUVERTURE>',
    '</ctxbam:COUVERTURE>',
    '</ctxbam:ContexteBAM> <ctxlps:ContexteLPS Nature="CTXLPS" Version="01_00">',
    `<ctxlps:Id>${defaultUuid}</ctxlps:Id>`,
    `<ctxlps:Temps>${new Date(defaultDate).toISOString()}</ctxlps:Temps>`,
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
}

export const getPierreAlainXmlResponse = ():string => {
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
    '<IdIndividu>',
    '<NumIdentifiant>2090763220834</NumIdentifiant>',
    '<Cle>39</Cle>',
    '<TypeMatricule>NIR</TypeMatricule>',
    '</IdIndividu>',
    '<OID>1.2.250.1.213.1.4.8</OID>',
    '</INSHISTO>',
    '<INSHISTO>',
    '<IdIndividu>',
    '<NumIdentifiant>2090663220123</NumIdentifiant>',
    '<Cle>55</Cle>',
    '<TypeMatricule>NIR</TypeMatricule>',
    '</IdIndividu>',
    '<OID>1.2.250.1.213.1.4.8</OID>',
    '</INSHISTO>',
    '<TIQ>',
    '<NomNaissance>ECETINSI</NomNaissance>',
    '<Prenom>PIERRE-ALAIN</Prenom>',
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
}

export const getPierreAlainLiveXmlResponse = ():string => {
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
    '<ns2:NumIdentifiant>1090763220834</ns2:NumIdentifiant>',
    '<ns2:Cle>89</ns2:Cle>',
    '</ns2:IdIndividu>',
    '<ns2:OID>1.2.250.1.213.1.4.8</ns2:OID>',
    '</ns2:INSACTIF>',
    '<ns2:INSHISTO>',
    '<ns2:IdIndividu>',
    '<ns2:NumIdentifiant>2090763220834</ns2:NumIdentifiant>',
    '<ns2:Cle>39</ns2:Cle>',
    '<ns2:TypeMatricule>NIR</ns2:TypeMatricule>',
    '</ns2:IdIndividu>',
    '<ns2:OID>1.2.250.1.213.1.4.8</ns2:OID>',
    '</ns2:INSHISTO>',
    '<ns2:TIQ>',
    '<ns2:NomNaissance>ECETINSI</ns2:NomNaissance>',
    '<ns2:Prenom>PIERRE-ALAIN</ns2:Prenom>',
    '<ns2:ListePrenom>PIERRE-ALAIN MURIEL FLORIANT</ns2:ListePrenom>',
    '<ns2:Sexe>M</ns2:Sexe>',
    '<ns2:DateNaissance>2009-07-14</ns2:DateNaissance>',
    '<ns2:LieuNaissance>63220</ns2:LieuNaissance>',
    '</ns2:TIQ>',
    '</ns2:INDIVIDU>',
    '</ns2:RESULTAT>',
    '</env:Body>',
    '</soap:Envelope>',
  ].join('');
}

export const getPierreAlainRawResponse = ({ liveVersion = false } = {}): FetchInsRawBody => ({
  CR: {
    CodeCR: CRCodes.OK,
    LibelleCR: CRLabels.OK,
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
        IdIndividu: {
          Cle: '39',
          NumIdentifiant: '2090763220834',
          TypeMatricule: 'NIR',
        },
        OID: '1.2.250.1.213.1.4.8',
      },
      ...(liveVersion ? [] : [{
        IdIndividu: {
          Cle: '55',
          NumIdentifiant: '2090663220123',
          TypeMatricule: 'NIR',
        },
        OID: '1.2.250.1.213.1.4.8',
      }]),
  ],
    TIQ: {
      NomNaissance: 'ECETINSI',
      Prenom: 'PIERRE-ALAIN',
      ListePrenom: 'PIERRE-ALAIN MURIEL FLORIANT',
      Sexe: Gender.Male,
      DateNaissance: '2009-07-14',
      LieuNaissance: '63220'
    }
  }
});

export const getPierreAlainFormattedResponse = (): FetchInsBody => ({
  birthName: 'ECETINSI',
  firstName: 'PIERRE-ALAIN',
  allFirstNames: 'PIERRE-ALAIN MURIEL FLORIANT',
  gender: Gender.Male,
  dateOfBirth: '2009-07-14',
  placeOfBirthCode: '63220',
  socialSecurityNumber: '109076322083489',
  oid: '1.2.250.1.213.1.4.8',
});
