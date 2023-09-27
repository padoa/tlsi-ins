import { getCNDAValidationXmlRequest } from '../insi-client.fixture';
import { Gender } from '../../class/insi-person.class';
import { IDAM, SOFTWARE_NAME, SOFTWARE_VERSION } from '../../models/env';


const getDeVinciRuthXmlRequest = (
  { idam, version, name, assertionPs, date }: { idam: string, version: string, name: string, assertionPs?: string, date?: string }
): string => getCNDAValidationXmlRequest({
  idam,
  version,
  name,
  date,
  birthName: 'DE VINCI',
  firstName: 'RUTH',
  gender: Gender.Female,
  dateOfBirth: '1976-07-14',
  assertionPs,
});


export const getDeVinciRuthMockedResponse = (): any => {
  return [
    {
      status: 'FAIL',
      request: {
        id: "b3d188ab-8bc5-4e75-b217-a0ecf58a6953",
        xml: getDeVinciRuthXmlRequest({
          idam: IDAM,
          version: SOFTWARE_VERSION,
          name: SOFTWARE_NAME,
          date: new Date().toISOString(),
        })
      },
      response: {
        "formatted": null,
        "json": null,
        "xml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\"><env:Body xmlns:S=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:env=\"http://www.w3.org/2003/05/soap-envelope\"><S:Fault xmlns:ns4=\"http://schemas.xmlsoap.org/soap/envelope/\"><S:Code><S:Value>S:Receiver</S:Value><S:Subcode><S:Value>S:siram_40</S:Value></S:Subcode></S:Code><S:Reason><S:Text xml:lang=\"en\">Le service est temporairement inaccessible. Veuillez renouveler votre demande ultérieurement. Si le problème persiste, contactez l'éditeur du progiciel ou votre responsable informatique.</S:Text></S:Reason><S:Detail><siram:Erreur severite=\"fatal\" code=\"insi_102\" xmlns:siram=\"urn:siram\">L'appel au service de recherche avec les traits d'identité renvoie une erreur technique.</siram:Erreur></S:Detail></S:Fault></env:Body></soap:Envelope>",
        "error": {
            "siramCode": "siram_40",
            "text": "Le service est temporairement inaccessible. Veuillez renouveler votre demande ultérieurement. Si le problème persiste, contactez l'éditeur du progiciel ou votre responsable informatique.",
            "desirCode": "insi_102",
            "error": "L'appel au service de recherche avec les traits d'identité renvoie une erreur technique."
        }
    }
    }
  ];
};