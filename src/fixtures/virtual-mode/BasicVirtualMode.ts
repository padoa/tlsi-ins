import _ from "lodash";
import { CRCodes, CRLabels, INSiMockedResponse, INSiServiceFetchInsRequest, INSiServiceFormattedResponse, InsHisto, INSiServiceRequestStatus, INSiServiceRequestEnv, INSiServiceJsonResponse, INSiServiceResponse } from "../../models/insi-fetch-ins.models";

export default class BasicVirtualMode {
    static insHisto: InsHisto[] = [];
    static personDetails: INSiServiceFormattedResponse;
    static fetchRequestFlow: INSiMockedResponse[];

    private static getXmlRequest(firstNameResquest: string, { idam, version, name, requestDate, requestId, emitter }: INSiServiceRequestEnv): string {
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
            `<insi_recsans_ins:NomNaissance>${this.personDetails.birthName}</insi_recsans_ins:NomNaissance>`,
            `<insi_recsans_ins:Prenom>${firstNameResquest}</insi_recsans_ins:Prenom>`,
            `<insi_recsans_ins:Sexe>${this.personDetails.gender}</insi_recsans_ins:Sexe>`,
            `<insi_recsans_ins:DateNaissance>${this.personDetails.dateOfBirth}</insi_recsans_ins:DateNaissance>`,
            '</insi_recsans_ins:RECSANSVITALE>',
            '</soap:Body>',
            '</soap:Envelope>',
        ].join('');
    }

    private static getXmlInsHisto(): string {
        if (_.isNil(this.insHisto) || this.insHisto.length === 0) {
            return "";
        }
        return this.insHisto.map((insHisto: InsHisto) => {
            return [
                '<INSHISTO>',
                '<IdIndividu>',
                `<NumIdentifiant>${insHisto.IdIndividu.NumIdentifiant}</NumIdentifiant>`,
                `<Cle>${insHisto.IdIndividu.Cle}</Cle>`,
                `<TypeMatricule>${insHisto.IdIndividu.TypeMatricule}</TypeMatricule>`,
                '</IdIndividu>',
                `<OID>${insHisto.OID}</OID>`,
                '</INSHISTO>',
            ];
        }).join('');
    }

    private static getValidXmlResponse(): string {
        const numIdentifiant = this.personDetails.registrationNumber?.slice(0, -2);
        const cle = this.personDetails.registrationNumber?.slice(-2);
        return [
            '<?xml version="1.0" encoding="UTF-8"?>\n',
            '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">',
            '<env:Body xmlns:S="http://www.w3.org/2003/05/soap-envelope" xmlns:env="http://www.w3.org/2003/05/soap-envelope">',
            '<RESULTAT xmlns="http://www.cnamts.fr/INSiResultat" xmlns:ns0="http://www.cnamts.fr/INSiRecVit" xmlns:ns1="http://www.cnamts.fr/INSiRecSans">',
            '<CR>',
            `<CodeCR>00</CodeCR>`,
            `<LibelleCR>OK</LibelleCR>`,
            '</CR>',
            '<INDIVIDU>',
            '<INSACTIF>',
            '<IdIndividu>',
            `<NumIdentifiant>${numIdentifiant}</NumIdentifiant>`,
            `<Cle>${cle}</Cle>`,
            '</IdIndividu>',
            `<OID>${this.personDetails.oid}</OID>`,
            '</INSACTIF>',
            this.getXmlInsHisto(),
            '<TIQ>',
            `<NomNaissance>${this.personDetails?.birthName}</NomNaissance>`,
            `<ListePrenom>${this.personDetails?.allFirstNames}</ListePrenom>`,
            `<Sexe>${this.personDetails?.gender}</Sexe>`,
            `<DateNaissance>${this.personDetails?.dateOfBirth}</DateNaissance>`,
            `<LieuNaissance>${this.personDetails?.placeOfBirthCode}</LieuNaissance>`,
            '</TIQ>',
            '</INDIVIDU>',
            '</RESULTAT>',
            '</env:Body>',
            '</soap:Envelope>',
        ].join('');
    };
    
    private static getNoIdentityXmlResponse(): string {
        return [
            '<?xml version="1.0" encoding="UTF-8"?>\n',
            '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">',
            '<S:Body xmlns:S=\"http://www.w3.org/2003/05/soap-envelope\">',
            '<RESULTAT xmlns:ns3=\"http://www.cnamts.fr/INSiRecVit\" xmlns:ns2=\"http://www.cnamts.fr/INSiRecSans\" xmlns=\"http://www.cnamts.fr/INSiResultat\">',
            '<CR>',
            `<CodeCR>01</CodeCR>`,
            `<LibelleCR>Aucune identite trouvee</LibelleCR>`,
            '</CR>',
            '</RESULTAT>',
            '</S:Body>',
            '</soap:Envelope>',
        ].join('');
    };

    private static buildJsonResponse(response: INSiMockedResponse): INSiServiceResponse {
        const numIdentifiant = this.personDetails.registrationNumber?.slice(0, -2);
        const cle = this.personDetails.registrationNumber?.slice(-2);
        switch (response.codeCR) {
            case CRCodes.NO_RESULT:
                return {
                    formatted: null,
                    json: {
                        CR: {
                            CodeCR: CRCodes.NO_RESULT,
                            LibelleCR: CRLabels.NO_RESULT
                        },
                    },
                    xml: this.getNoIdentityXmlResponse(),
                    error: null
                }
                break;
            case CRCodes.OK:
                return {
                    formatted: this.personDetails as INSiServiceFormattedResponse,
                    json: {
                        CR: {
                            CodeCR: CRCodes.OK,
                            LibelleCR: CRLabels.OK,
                        },
                        INDIVIDU: {
                            INSACTIF: {
                                IdIndividu: {
                                    NumIdentifiant: numIdentifiant,
                                    Cle: cle
                                },
                                OID: this.personDetails.oid
                            },
                            ...this.insHisto.length > 0 ? {INSHISTO: this.insHisto} : {},
                            TIQ: {
                                NomNaissance: this.personDetails.birthName,
                                ListePrenom: this.personDetails.allFirstNames,
                                Sexe: this.personDetails.gender,
                                DateNaissance: this.personDetails.dateOfBirth,
                                LieuNaissance: this.personDetails.placeOfBirthCode
                            }
                        }
                    },
                    xml: this.getValidXmlResponse(),
                    error: null
                }
                break;
        
            default:
                throw new Error("CR code unvalid !");
                break;
        }
    }

    static getBuiltResponse(clientConfig: INSiServiceRequestEnv): INSiServiceFetchInsRequest[] {
        return this.fetchRequestFlow.map((response: INSiMockedResponse): INSiServiceFetchInsRequest => {
            return {
                status: INSiServiceRequestStatus.SUCCESS,
                request: {
                    id: clientConfig.requestId as string,
                    xml: this.getXmlRequest(response.firstnameRequest, clientConfig)
                },
                response: this.buildJsonResponse(response),
            }
        })
    }
}