import _ from "lodash";
import { INSiPersonArgs } from "../../class/insi-person.class";
import { CRCodes, CRLabels, INSiMockedResponse, INSiServiceFetchInsRequest, INSiServiceFormattedResponse, InsHisto, INSiServiceRequestStatus, INSiServiceRequest } from "../../models/insi-fetch-ins.models";
import { getCNDAValidationXmlRequest } from "../insi-client.fixture";

export default class BasicVirtualMode {
    fetchRequestFlow: INSiMockedResponse[];
    personDetails: INSiServiceFormattedResponse;
    constructor(fetchRequestFlow: INSiMockedResponse[], personDetails: INSiServiceFormattedResponse) {
        this.fetchRequestFlow = fetchRequestFlow;
        this.personDetails = personDetails;
    }

    getXmlRequest(person: INSiPersonArgs, firstNameResquest: string, requestDate: string, requestId: string, { idam, version, name, assertionPs }: { idam: string, version: string, name: string, assertionPs?: string }): string {
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

    getInsHisto = (insHisto: InsHisto[] | undefined): string => {
        if (_.isNil(insHisto) || insHisto.length === 0) {
            return "";
        }
        return insHisto.map((insHisto: InsHisto) => {
            return [
                '<INSHISTO>',
                '<IdIndividu>',
                `<NumIdentifiant>${insHisto.IdIndividu.NumIdentifiant}</NumIdentifiant>`,
                `<Cle>${insHisto.IdIndividu.Cle}</Cle>`,
                `<TypeMatricule>${insHisto.IdIndividu.TypeMatricule}</TypeMatricule>`,
                '</IdIndividu>',
                `<OID>${insHisto.OID}</OID>`,
                '</INSACTIF>',
            ]; 
        }).join('');
    }

    getValidXmlResponse(response: INSiMockedResponse): string {
        const insHisto = this.getInsHisto(response.json?.INDIVIDU?.INSHISTO);
        return [
            '<?xml version="1.0" encoding="UTF-8"?>\n',
            '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">',
            '<env:Body xmlns:S="http://www.w3.org/2003/05/soap-envelope" xmlns:env="http://www.w3.org/2003/05/soap-envelope">',
            '<RESULTAT xmlns="http://www.cnamts.fr/INSiResultat" xmlns:ns0="http://www.cnamts.fr/INSiRecVit" xmlns:ns1="http://www.cnamts.fr/INSiRecSans">',
            '<CR>',
            `<CodeCR>${response.codeCR}</CodeCR>`,
            `<LibelleCR>${response.LibelleCR}</LibelleCR>`,
            '</CR>',
            '<INDIVIDU>',
            '<INSACTIF>',
            '<IdIndividu>',
            `<NumIdentifiant>${response.json?.INDIVIDU?.INSACTIF?.IdIndividu?.NumIdentifiant}</NumIdentifiant>`,
            `<Cle>${response.json?.INDIVIDU?.INSACTIF?.IdIndividu?.Cle}</Cle>`,
            '</IdIndividu>',
            `<OID>${response.json?.INDIVIDU?.INSACTIF?.OID}</OID>`,
            '</INSACTIF>',
            insHisto,
            '<TIQ>',
            `<NomNaissance>${response.formatted?.birthName}</NomNaissance>`,
            `<ListePrenom>${response.formatted?.allFirstNames}</ListePrenom>`,
            `<Sexe>M</Sexe>`,
            `<DateNaissance>${response.formatted?.dateOfBirth}</DateNaissance>`,
            `<LieuNaissance>${response.formatted?.placeOfBirthCode}</LieuNaissance>`,
            '</TIQ>',
            '</INDIVIDU>',
            '</RESULTAT>',
            '</env:Body>',
            '</soap:Envelope>',
        ].join('');
    };
    getFailedXmlResponse(): string {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\">\r\n  <S:Body xmlns:S=\"http://www.w3.org/2003/05/soap-envelope\">\r\n    <RESULTAT xmlns:ns3=\"http://www.cnamts.fr/INSiRecVit\" xmlns:ns2=\"http://www.cnamts.fr/INSiRecSans\" xmlns=\"http://www.cnamts.fr/INSiResultat\">\r\n      <CR>\r\n        <CodeCR>01</CodeCR>\r\n        <LibelleCR>Aucune identite trouvee</LibelleCR>\r\n      </CR>\r\n </RESULTAT>\r\n  </S:Body>\r\n</soap:Envelope>";
    };
    
    getBuiltResponse({ idam, version, name, requestId, requestDate }: any): INSiServiceFetchInsRequest[] {
        return this.fetchRequestFlow.map((response: INSiMockedResponse): INSiServiceFetchInsRequest => {
            const getRequest: INSiServiceRequest = {
                id: requestId,
                xml: this.getXmlRequest(this.personDetails as INSiPersonArgs, response.firstnameRequest, requestDate, requestId, { idam, version, name })
            };
            if (response.status === INSiServiceRequestStatus.FAIL) {
                return {
                    status: response.status,
                    request: getRequest,
                    response: {
                        formatted: null,
                        json: null,
                        xml: this.getFailedXmlResponse(),
                        error: {
                            siramCode: "siram_40",
                            text: "Le service est temporairement inaccessible. Veuillez renouveler votre demande ultérieurement. Si le problème persiste, contactez l'éditeur du progiciel ou votre responsable informatique.",
                            desirCode: "insi_102",
                            error: "L'appel au service de recherche avec les traits d'identité renvoie une erreur technique."
                        }
                    }
                }
            }
            return response.codeCR === CRCodes.NO_RESULT ?
                {
                    status: response.status,
                    request: getRequest,
                    response: {
                        formatted: null,
                        json: {
                            CR: {
                                CodeCR: CRCodes.NO_RESULT,
                                LibelleCR: CRLabels.NO_RESULT
                            },
                        },
                        xml: this.getFailedXmlResponse(),
                        error: null
                    }
                } :
                {
                    status: response.status,
                    request: getRequest,
                    response: {
                        formatted: response.formatted,
                        json: response.json,
                        xml: this.getValidXmlResponse(response),
                        error: null
                    }
                } as INSiServiceFetchInsRequest;
        })
    }
}