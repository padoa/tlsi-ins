import _ from "lodash";
import { INSiPersonArgs } from "../../class/insi-person.class";
import { CRCodes, CRLabels, INSiMockedResponse, INSiServiceFetchInsRequest, INSiServiceFormattedResponse, InsHisto, INSiServiceRequestStatus, INSiServiceRequest, INSiServiceRequestEnv } from "../../models/insi-fetch-ins.models";
import { getCNDAValidationXmlRequest } from "../insi-client.fixture";

export default class BasicVirtualMode {
    fetchRequestFlow: INSiMockedResponse[];
    personDetails: INSiServiceFormattedResponse;
    constructor(fetchRequestFlow: INSiMockedResponse[], personDetails: INSiServiceFormattedResponse) {
        this.fetchRequestFlow = fetchRequestFlow;
        this.personDetails = personDetails;
    }

    getXmlRequest(person: INSiPersonArgs, firstNameResquest: string, { idam, version, name, requestDate, requestId, emitter }: INSiServiceRequestEnv): string {
        return [
            '<?xml version="1.0" encoding="utf-8"?>',
            '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  xmlns:tns="http://www.cnamts.fr/webservice" xmlns:insi="http://www.cnamts.fr/ServiceIdentiteCertifiee/v1" xmlns:insi_recsans_ins="http://www.cnamts.fr/INSiRecSans" xmlns:insi_recvit_ins="http://www.cnamts.fr/INSiRecVit" xmlns:insi_resultat_ins="http://www.cnamts.fr/INSiResultat" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:ctxbam="urn:siram:bam:ctxbam" xmlns:ctxlps="urn:siram:lps:ctxlps" xmlns:siram="urn:siram" xmlns:jaxb="http://java.sun.com/xml/ns/jaxb" xmlns:xjc="http://java.sun.com/xml/ns/jaxb/xjc">',
            '<soap:Header>',
            '<ctxbam:ContexteBAM Version="01_02">',
            `<ctxbam:Id>${requestId}</ctxbam:Id>`,
            `<ctxbam:Temps>${new Date(requestDate as string).toISOString()}</ctxbam:Temps>`,
            `<ctxbam:Emetteur>${emitter}</ctxbam:Emetteur>`,
            '<ctxbam:COUVERTURE>',
            '</ctxbam:COUVERTURE>',
            '</ctxbam:ContexteBAM> <ctxlps:ContexteLPS Nature="CTXLPS" Version="01_00">',
            `<ctxlps:Id>${requestId}</ctxlps:Id>`,
            `<ctxlps:Temps>${new Date(requestDate as string).toISOString()}</ctxlps:Temps>`,
            `<ctxlps:Emetteur>${emitter}</ctxlps:Emetteur>`,
            '<ctxlps:LPS>',
            `<ctxlps:IDAM R="4">${idam}</ctxlps:IDAM>`,
            `<ctxlps:Version>${version}</ctxlps:Version>`,
            '<ctxlps:Instance>b3549edd-4ae9-472a-b26f-fd2fb4ef397f</ctxlps:Instance>',
            `<ctxlps:Nom>urn:lps:${name}:${version}</ctxlps:Nom>`,
            '</ctxlps:LPS>',
            '</ctxlps:ContexteLPS> <wsa:Action xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns="http://www.w3.org/2005/08/addressing">urn:ServiceIdentiteCertifiee:1.0.0:rechercherInsAvecTraitsIdentite</wsa:Action> <wsa:MessageID xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns="http://www.w3.org/2005/08/addressing">uuid:b3549edd-4ae9-472a-b26f-fd2fb4ef397f</wsa:MessageID>',
            '</soap:Header>',
            '<soap:Body>',
            '<insi_recsans_ins:RECSANSVITALE xmlns:insi_recsans_ins="http://www.cnamts.fr/INSiRecSans" xmlns="http://www.cnamts.fr/INSiRecSans">',
            `<insi_recsans_ins:NomNaissance>${person.birthName}</insi_recsans_ins:NomNaissance>`,
            `<insi_recsans_ins:Prenom>${firstNameResquest}</insi_recsans_ins:Prenom>`,
            `<insi_recsans_ins:Sexe>${person.gender}</insi_recsans_ins:Sexe>`,
            `<insi_recsans_ins:DateNaissance>${person.dateOfBirth}</insi_recsans_ins:DateNaissance>`,
            '</insi_recsans_ins:RECSANSVITALE>',
            '</soap:Body>',
            '</soap:Envelope>',
          ].join('');
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
    
    getBuiltResponse({ idam, version, name, requestId, requestDate, emitter }: INSiServiceRequestEnv): INSiServiceFetchInsRequest[] {
        return this.fetchRequestFlow.map((response: INSiMockedResponse): INSiServiceFetchInsRequest => {
            const getRequest: INSiServiceRequest = {
                id: requestId as string,
                xml: this.getXmlRequest(this.personDetails as INSiPersonArgs, response.firstnameRequest, { idam, version, name, requestId, requestDate, emitter })
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