import {
  CRCodes,
  CRLabels,
  INSiServiceFormattedResponse,
  INSiServiceJsonResponse,
  INSiServiceResponse,
} from '../../models/insi-fetch-ins.models';
import { Gender } from '../../class/insi-person.class';
import { getCNDAValidationXmlRequest } from '../insi-client.fixture';

export const getTchitchiOlaXmlRequest = ({ idam, version, name }: { idam: string, version: string, name: string }): string => getCNDAValidationXmlRequest({
  idam,
  version,
  name,
  birthName: 'TCHITCHI',
  firstName: 'OLA',
  gender: Gender.Female,
  dateOfBirth: '1936-06-21',
});

export const getTchitchiCatarinaXmlRequest = ({ idam, version, name }: { idam: string, version: string, name: string }): string => getCNDAValidationXmlRequest({
  idam,
  version,
  name,
  birthName: 'TCHITCHI',
  firstName: 'CATARINA',
  gender: Gender.Female,
  dateOfBirth: '1936-06-21',
});

export const getTchitchiCatarinaXmlResponse = ():string => [
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

export const getTchitchiCatarinaJsonResponse = (): INSiServiceJsonResponse => ({
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
      ListePrenom: 'CATARINA BELLA',
      Sexe: Gender.Female,
      DateNaissance: '1936-06-21',
      LieuNaissance: '63220'
    }
  }
});

export const getTchitchiCatarinaFormattedResponse = (): INSiServiceFormattedResponse => ({
  birthName: 'TCHITCHI',
  firstName: 'CATARINA',
  allFirstNames: 'CATARINA BELLA',
  gender: Gender.Female,
  dateOfBirth: '1936-06-21',
  placeOfBirthCode: '63220',
  registrationNumber: '236066322083656',
  oid: '1.2.250.1.213.1.4.8',
});

export const getTchitchiCatarinaResponse = (): INSiServiceResponse => ({
  formatted: getTchitchiCatarinaFormattedResponse(),
  json: getTchitchiCatarinaJsonResponse(),
  xml: getTchitchiCatarinaXmlResponse(),
  error: null,
});
