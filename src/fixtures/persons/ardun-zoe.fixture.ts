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

const getAdrunZoeXmlRequest = (
  { idam, version, name, assertionPs, requestDate }: { idam: string, version: string, name: string, assertionPs?: string, requestDate?: string }
): string => getCNDAValidationXmlRequest({
  idam,
  version,
  name,
  requestDate,
  birthName: 'ADRUN',
  firstName: 'ZOE',
  gender: Gender.Female,
  dateOfBirth: '1975-12-31',
  assertionPs,
});

const getAdrunZoeXmlResponse = (): string => [
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
  '<NumIdentifiant>275126322074974</NumIdentifiant>',
  '<Cle>13</Cle>',
  '</IdIndividu>',
  '<OID>1.2.250.1.213.1.4.8</OID>',
  '</INSACTIF>',
  '<TIQ>',
  '<NomNaissance>ADRUN</NomNaissance>',
  '<ListePrenom>ZOE</ListePrenom>',
  '<Sexe>F</Sexe>',
  '<DateNaissance>1975-12-31</DateNaissance>',
  '<LieuNaissance>63220</LieuNaissance>',
  '</TIQ>',
  '</INDIVIDU>',
  '</RESULTAT>',
  '</env:Body>',
  '</soap:Envelope>',
].join('');

const getAdrunZoeRawResponse = (): INSiServiceJsonResponse => ({
  CR: {
    CodeCR: CRCodes.OK,
    LibelleCR: CRLabels.OK,
  },
  INDIVIDU: {
    INSACTIF: {
      IdIndividu: {
        NumIdentifiant: '275126322074974',
        Cle: '74',
      },
      OID: '1.2.250.1.213.1.4.8',
    },
    TIQ: {
      NomNaissance: 'ADRUN',
      ListePrenom: 'ZOE',
      Sexe: Gender.Female,
      DateNaissance: '1975-12-31',
      LieuNaissance: '63220',
    },
  },
});

const getAdrunZoeFormattedResponse = (): INSiServiceFormattedResponse => ({
  oid: '1.2.250.1.213.1.4.8',
  gender: Gender.Female,
  birthName: 'ADRUN',
  firstName: 'ZOE',
  dateOfBirth: '1975-12-31',
  allFirstNames: 'ZOE',
  placeOfBirthCode: '63220',
  registrationNumber: '275126322074974',
});

const getAdrunZoeResponse = (): INSiServiceResponse => ({
  formatted: getAdrunZoeFormattedResponse(),
  json: getAdrunZoeRawResponse(),
  xml: getAdrunZoeXmlResponse(),
  error: null,
});

export const getAdrunMockedResponse = (): any => {
  return [
    {
      status: 'SUCCESS',
      request: {
        id: "b3d188ab-8bc5-4e75-b217-a0ecf58a6953",
        xml: getAdrunZoeXmlRequest({
          idam: IDAM,
          version: SOFTWARE_VERSION,
          name: SOFTWARE_NAME,
          requestDate: new Date().toISOString(),
        })
      },
      response: getAdrunZoeResponse()
    }
  ];
};