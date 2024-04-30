import {
  CRCodes,
  CRLabels,
  INSiServiceFormattedResponse,
  INSiServiceJsonResponse,
  INSiServiceResponse,
} from '../../models/insi-fetch-ins.models';
import { Gender } from '../../class/insi-person.class';
import { getCNDAValidationXmlRequest } from '../insi-client.fixture';

export const getAdrtroisDominiqueXmlRequest = ({ idam, version, name }: { idam: string, version: string, name: string }): string => getCNDAValidationXmlRequest({
  idam,
  version,
  name,
  birthName: 'ADRTROIS',
  firstName: 'DOMINIQUE',
  gender: Gender.Female,
  dateOfBirth: '1997-02-26',
})

export const getAdrtroisDominiqueXmlResponse = ():string => [
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

export const getAdrtroisDominiqueRawResponse = (): INSiServiceJsonResponse => ({
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
      ListePrenom: 'DOMINIQUE',
      Sexe: Gender.Female,
      DateNaissance: '1997-02-26',
      LieuNaissance: '2A020'
    }
  }
});

export const getAdrtroisDominiqueFormattedResponse = (): INSiServiceFormattedResponse => ({
  birthName: 'ADRTROIS',
  firstName: 'DOMINIQUE',
  allFirstNames: 'DOMINIQUE',
  gender: Gender.Female,
  dateOfBirth: '1997-02-26',
  placeOfBirthCode: '2A020',
  registrationNumber: '297022A02077878',
  oid: '1.2.250.1.213.1.4.8',
});

export const getAdrtroisDominiqueResponse = (): INSiServiceResponse => ({
  formatted: getAdrtroisDominiqueFormattedResponse(),
  json: getAdrtroisDominiqueRawResponse(),
  xml: getAdrtroisDominiqueXmlResponse(),
  error: null,
});
