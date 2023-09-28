import {
  CRCodes,
  CRLabels,
  INSiServiceFetchInsRequest,
  INSiServiceFormattedResponse,
  INSiServiceJsonResponse,
  INSiServiceRequestStatus,
  INSiServiceResponse,
} from '../../models/insi-fetch-ins.models';
import { Gender } from '../../class/insi-person.class';
import { getCNDAValidationXmlRequest } from '../insi-client.fixture';
import { IDAM, SOFTWARE_NAME, SOFTWARE_VERSION } from '../../models/env';

export const getTchitchiCatarinaXmlRequest = (
  { idam, version, name, assertionPs, requestDate, firstName = 'OLA CATARINA BELLA' }: { idam: string, version: string, name: string, assertionPs?: string, requestDate?: string, firstName?: string }
): string => getCNDAValidationXmlRequest({
  idam,
  version,
  name,
  requestDate: requestDate,
  birthName: 'TCHITCHI',
  firstName: firstName,
  gender: Gender.Female,
  dateOfBirth: '1976-07-14',
  assertionPs,
});

export const getTchitchiOlaXmlRequest = ({ idam, version, name }: { idam: string, version: string, name: string }): string => getCNDAValidationXmlRequest({
  idam,
  version,
  name,
  birthName: 'TCHITCHI',
  firstName: 'OLA',
  gender: Gender.Female,
  dateOfBirth: '1936-06-21',
});

const getTchitchiCatarinaXmlResponse = (): string => [
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

const getTchitchiCatarinaJsonResponse = (): INSiServiceJsonResponse => ({
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

const getTchitchiCatarinaFormattedResponse = (): INSiServiceFormattedResponse => ({
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


export const getTchitchiCatarinaMockedResponse = (): INSiServiceFetchInsRequest[] => {
  return [
    {
      status: INSiServiceRequestStatus.SUCCESS,
      request: {
        id: "b3d188ab-8bc5-4e75-b217-a0ecf58a6953",
        xml: getTchitchiCatarinaXmlRequest({
          idam: IDAM,
          version: SOFTWARE_VERSION,
          name: SOFTWARE_NAME,
          requestDate: new Date().toISOString(),
          firstName: "OLA"
        })
      },
      response: {
        formatted: null,
        json: {
          CR: {
            CodeCR: CRCodes.NO_RESULT,
            LibelleCR: CRLabels.NO_RESULT
          },
        },
        xml: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\"><env:Body xmlns:S=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:env=\"http://www.w3.org/2003/05/soap-envelope\"><S:Fault xmlns:ns4=\"http://schemas.xmlsoap.org/soap/envelope/\"><S:Code><S:Value>S:Receiver</S:Value><S:Subcode><S:Value>S:siram_40</S:Value></S:Subcode></S:Code><S:Reason><S:Text xml:lang=\"en\">Le service est temporairement inaccessible. Veuillez renouveler votre demande ultérieurement. Si le problème persiste, contactez l'éditeur du progiciel ou votre responsable informatique.</S:Text></S:Reason><S:Detail><siram:Erreur severite=\"fatal\" code=\"insi_102\" xmlns:siram=\"urn:siram\">L'appel au service de recherche avec les traits d'identité renvoie une erreur technique.</siram:Erreur></S:Detail></S:Fault></env:Body></soap:Envelope>",
        error: null
      }
    },
    {
      status: INSiServiceRequestStatus.SUCCESS,
      request: {
        id: "b3d188ab-8bc5-4e75-b217-a0ecf58a6953",
        xml: getTchitchiCatarinaXmlRequest({
          idam: IDAM,
          version: SOFTWARE_VERSION,
          name: SOFTWARE_NAME,
          requestDate: new Date().toISOString(),
          firstName: "CATARINA"
        })
      },
      response: getTchitchiCatarinaResponse()
    }
  ];
};
