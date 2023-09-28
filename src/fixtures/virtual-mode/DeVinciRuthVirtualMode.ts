import { Gender, INSiPersonArgs } from "../../class/insi-person.class";
import { getCNDAValidationXmlRequest } from "../insi-client.fixture";
import BasicVirtualMode from "./BasicVirtualMode";
import { CRCodes, CRLabels, INSiServiceFetchInsRequest, INSiServiceFormattedResponse, INSiServiceJsonResponse, INSiServiceRequestStatus } from "../../models/insi-fetch-ins.models";
import { v4 as uuidv4 } from 'uuid';

export class DeVinciRuthVirtualMode extends BasicVirtualMode {
    getXmlRequest(person: INSiPersonArgs, firstNameResquest: string, requestDate: string, requestId: string, { idam, version, name, assertionPs }: { idam: string, version: string, name: string, assertionPs?: string }): any {
        return getCNDAValidationXmlRequest({
            idam,
            version,
            name,
            requestDate,
            requestId,
            birthName: person.birthName,
            firstName: firstNameResquest,
            gender: person.gender,
            dateOfBirth: person.dateOfBirth,
            assertionPs,
        });
    }

    getValidXmlResponse(): string {
        return "";
    }
    getFailedXmlResponse = (): string => "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\">\r\n  <S:Body xmlns:S=\"http://www.w3.org/2003/05/soap-envelope\">\r\n    <RESULTAT xmlns:ns3=\"http://www.cnamts.fr/INSiRecVit\" xmlns:ns2=\"http://www.cnamts.fr/INSiRecSans\" xmlns=\"http://www.cnamts.fr/INSiResultat\">\r\n      <CR>\r\n        <CodeCR>01</CodeCR>\r\n        <LibelleCR>Aucune identite trouvee</LibelleCR>\r\n      </CR>\r\n    </RESULTAT>\r\n  </S:Body>\r\n</soap:Envelope>";

    static getMockedResponse(person: INSiPersonArgs, requestId: string, { idam, version, name, requestDate }: { idam: string, version: string, name: string, requestDate: string }): INSiServiceFetchInsRequest[] {
        const deVinciRuthVirtualMode = new DeVinciRuthVirtualMode();
        return [
            {
                status: INSiServiceRequestStatus.FAIL,
                request: {
                    id: uuidv4(),
                    xml: deVinciRuthVirtualMode.getXmlRequest(person, person.firstName, requestDate, requestId, { idam, version, name })
                },
                response: {
                  "formatted": null,
                  "json": null,
                  "xml": deVinciRuthVirtualMode.getFailedXmlResponse(),
                  "error": {
                      "siramCode": "siram_40",
                      "text": "Le service est temporairement inaccessible. Veuillez renouveler votre demande ultérieurement. Si le problème persiste, contactez l'éditeur du progiciel ou votre responsable informatique.",
                      "desirCode": "insi_102",
                      "error": "L'appel au service de recherche avec les traits d'identité renvoie une erreur technique."
                  }
                }
              },
        ];
    }
}
