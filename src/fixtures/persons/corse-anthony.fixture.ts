import { getCNDAValidationXmlRequest } from '../insi-client.fixture';
import { Gender } from '../../class/insi-person.class';
import {
  CRCodes,
  CRLabels,
  INSiServiceFormattedResponse,
  INSiServiceJsonResponse,
  INSiServiceResponse,
} from '../../models/insi-fetch-ins.models';
import { IDAM, SOFTWARE_NAME, SOFTWARE_VERSION } from '../../models/env';

const getCorseAnthonyXmlRequest = (
  { idam, version, name, assertionPs, date }: { idam: string, version: string, name: string, assertionPs?: string, date?: string }
): string => getCNDAValidationXmlRequest({
  idam,
  version,
  name,
  date,
  birthName: 'CORSE',
  firstName: 'ANTHONY',
  gender: Gender.Male,
  dateOfBirth: '1980-03-02',
  assertionPs,
});

export const getCorseAnthonyXmlResponse = (): string => [
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
  '<NumIdentifiant>180032B02040123</NumIdentifiant>',
  '<Cle>13</Cle>',
  '</IdIndividu>',
  '<OID>1.2.250.1.213.1.4.8</OID>',
  '</INSACTIF>',
  '<TIQ>',
  '<NomNaissance>CORSE</NomNaissance>',
  '<ListePrenom>ANTHONY</ListePrenom>',
  '<Sexe>M</Sexe>',
  '<DateNaissance>1980-03-02</DateNaissance>',
  '<LieuNaissance>2B020</LieuNaissance>',
  '</TIQ>',
  '</INDIVIDU>',
  '</RESULTAT>',
  '</env:Body>',
  '</soap:Envelope>',
].join('');

export const getCorseAnthonyRawResponse = (): INSiServiceJsonResponse => ({
  CR: {
    CodeCR: CRCodes.OK,
    LibelleCR: CRLabels.OK,
  },
  INDIVIDU: {
    INSACTIF: {
      OID: '1.2.250.1.213.1.4.8',
      IdIndividu: {
        Cle: '23',
        NumIdentifiant: '180032B020401',
      },
    },
    INSHISTO: [
      {
        IdIndividu: {
            NumIdentifiant: "180032B020401",
            Cle: "23"
        },
        OID: "1.2.250.1.213.1.4.8"
      }
    ],
    TIQ: {
      NomNaissance: 'CORSE',
      Prenom: "ANTHONY",
      ListePrenom: 'ANTHONY',
      Sexe: Gender.Male,
      DateNaissance: '1980-03-02',
      LieuNaissance: '2B020',
    },
  },
});

export const getCorseAnthonyFormattedResponse = (): INSiServiceFormattedResponse => ({
  oid: '1.2.250.1.213.1.4.8',
  gender: Gender.Male,
  birthName: 'CORSE',
  firstName: 'ANTHONY',
  dateOfBirth: '1980-03-02',
  allFirstNames: 'ANTHONY',
  placeOfBirthCode: '2B020',
  registrationNumber: '180032B02040123',
});

export const getCorseAnthonyResponse = (): INSiServiceResponse => ({
  formatted: getCorseAnthonyFormattedResponse(),
  json: getCorseAnthonyRawResponse(),
  xml: getCorseAnthonyXmlResponse(),
  error: null,
});

export const getCorseMockedResponse = (): any => {
  return [
    {
      status: 'SUCCESS',
      request: {
        id: "b3d188ab-8bc5-4e75-b217-a0ecf58a6953",
        xml: getCorseAnthonyXmlRequest({
          idam: IDAM,
          version: SOFTWARE_VERSION,
          name: SOFTWARE_NAME,
          date: new Date().toISOString(),
        })
      },
      response: getCorseAnthonyResponse()
    }
  ];
};