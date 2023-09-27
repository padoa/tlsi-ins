import { getCNDAValidationXmlRequest } from '../insi-client.fixture';
import { Gender } from '../../class/insi-person.class';
import {
  CRCodes,
  CRLabels,
  INSiServiceFormattedResponse,
  INSiServiceJsonResponse,
  INSiServiceResponse,
} from '../../models/insi-fetch-ins.models';

export const getAdrtroisToussaintXmlRequest = (
  { idam, version, name, assertionPs }: { idam: string, version: string, name: string, assertionPs?: string }
): string => getCNDAValidationXmlRequest({
  idam,
  version,
  name,
  birthName: 'ADRTROIS',
  firstName: 'TOUSSAINT',
  gender: Gender.Male,
  dateOfBirth: '1960-01-01',
  assertionPs,
});

export const getAdrtroisToussaintXmlResponse = (): string => [
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
  '<NumIdentifiant>160012B020777</NumIdentifiant>',
  '<Cle>13</Cle>',
  '</IdIndividu>',
  '<OID>1.2.250.1.213.1.4.8</OID>',
  '</INSACTIF>',
  '<TIQ>',
  '<NomNaissance>ADRTROIS</NomNaissance>',
  '<ListePrenom>TOUSSAINT</ListePrenom>',
  '<Sexe>M</Sexe>',
  '<DateNaissance>1960-01-01</DateNaissance>',
  '<LieuNaissance>2B020</LieuNaissance>',
  '</TIQ>',
  '</INDIVIDU>',
  '</RESULTAT>',
  '</env:Body>',
  '</soap:Envelope>',
].join('');

export const getAdrtroisToussaintRawResponse = (): INSiServiceJsonResponse => ({
  CR: {
    CodeCR: CRCodes.OK,
    LibelleCR: CRLabels.OK,
  },
  INDIVIDU: {
    TIQ: {
      Sexe: Gender.Male,
      ListePrenom: 'TOUSSAINT',
      NomNaissance: 'ADRTROIS',
      DateNaissance: '1960-01-01',
      LieuNaissance: '2B020',
    },
    INSACTIF: {
      OID: '1.2.250.1.213.1.4.8',
      IdIndividu: {
        Cle: '13',
        NumIdentifiant: '160012B020777',
      },
    },
  },
});

export const getAdrtroisToussaintFormattedResponse = (): INSiServiceFormattedResponse => ({
  oid: '1.2.250.1.213.1.4.8',
  gender: Gender.Male,
  birthName: 'ADRTROIS',
  firstName: 'TOUSSAINT',
  dateOfBirth: '1960-01-01',
  allFirstNames: 'TOUSSAINT',
  placeOfBirthCode: '2B020',
  registrationNumber: '160012B02077713',
});

export const getAdrtroisToussaintResponse = (): INSiServiceResponse => ({
  formatted: getAdrtroisToussaintFormattedResponse(),
  json: getAdrtroisToussaintRawResponse(),
  xml: getAdrtroisToussaintXmlResponse(),
  error: null,
});

export const getAdrtroisMockedResponse = (): any => {
  return [
    {
      status: 'SUCCESS',
      request: {
        id: "",
        xml: ""
      },
      response: getAdrtroisToussaintResponse()
    }
  ];
};