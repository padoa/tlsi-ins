import {
  CRCodes,
  CRLabels,
  INSiServiceFormattedResponse,
  INSiServiceJsonResponse,
} from '../../models/insi-fetch-ins.models';
import { Gender } from '../../class/insi-person.class';
import { getCNDAValidationXmlRequest } from '../insi-client.fixture';

export const getPierreAlainXmlRequest = ({ idam, version, name }: { idam: string, version: string, name: string }): string => getCNDAValidationXmlRequest({
  idam,
  version,
  name,
  birthName: 'ECETINSI',
  firstName: 'PIERRE-ALAIN',
  gender: Gender.Male,
  dateOfBirth: '2009-07-14',
})

export const getPierreAlainXmlResponse = ():string => [
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

export const getPierreAlainLiveXmlResponse = ():string => [
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

export const getPierreAlainRawResponse = ({ liveVersion = false } = {}): INSiServiceJsonResponse => ({
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
      Sexe: Gender.Male,
      DateNaissance: '2009-07-14',
      LieuNaissance: '63220'
    }
  }
});

export const getPierreAlainFormattedResponse = (): INSiServiceFormattedResponse => ({
  birthName: 'ECETINSI',
  firstName: 'PIERRE-ALAIN',
  allFirstNames: 'PIERRE-ALAIN MURIEL FLORIANT',
  gender: Gender.Male,
  dateOfBirth: '2009-07-14',
  placeOfBirthCode: '63220',
  socialSecurityNumber: '109076322083489',
  oid: '1.2.250.1.213.1.4.8',
});
