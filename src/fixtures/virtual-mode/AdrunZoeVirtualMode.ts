import { Gender, INSiPersonArgs } from "../../class/insi-person.class";
import { getCNDAValidationXmlRequest } from "../insi-client.fixture";
import BasicVirtualMode from "./BasicVirtualMode";
import { CRCodes, CRLabels, INSiServiceFetchInsRequest, INSiServiceFormattedResponse, INSiServiceJsonResponse, INSiServiceRequestStatus } from "../../models/insi-fetch-ins.models";
import { v4 as uuidv4 } from 'uuid';

export class AdrunZoeVirtualMode extends BasicVirtualMode {
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
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\"><env:Body xmlns:S=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:env=\"http://www.w3.org/2003/05/soap-envelope\"><RESULTAT xmlns=\"http://www.cnamts.fr/INSiResultat\" xmlns:ns0=\"http://www.cnamts.fr/INSiRecVit\" xmlns:ns1=\"http://www.cnamts.fr/INSiRecSans\"><CR><CodeCR>00</CodeCR><LibelleCR>OK</LibelleCR></CR><INDIVIDU><INSACTIF><IdIndividu><NumIdentifiant>2751263220749</NumIdentifiant><Cle>74</Cle></IdIndividu><OID>1.2.250.1.213.1.4.8</OID></INSACTIF><TIQ><NomNaissance>ADRUN</NomNaissance><ListePrenom>ZOE</ListePrenom><Sexe>F</Sexe><DateNaissance>1975-12-31</DateNaissance><LieuNaissance>63220</LieuNaissance></TIQ></INDIVIDU></RESULTAT></env:Body></soap:Envelope>";
    }
    getFailedXmlResponse = (): string => "";


    static getMockedResponse(person: INSiPersonArgs, requestId: string, { idam, version, name, requestDate }: { idam: string, version: string, name: string, requestDate: string }): INSiServiceFetchInsRequest[] {
        const adrunZoeVirtualMode = new AdrunZoeVirtualMode();
        return [
            {
                status: INSiServiceRequestStatus.SUCCESS,
                request: {
                    id: uuidv4(),
                    xml: adrunZoeVirtualMode.getXmlRequest(person, person.firstName, requestDate, requestId, { idam, version, name })
                },
                response: {
                    formatted: {
                        oid: '1.2.250.1.213.1.4.8',
                        gender: Gender.Female,
                        birthName: 'ADRUN',
                        firstName: 'ZOE',
                        dateOfBirth: '1975-12-31',
                        allFirstNames: 'ZOE',
                        placeOfBirthCode: '63220',
                        registrationNumber: '275126322074974',
                    },
                    json: {
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
                        }
                    },
                    "xml": adrunZoeVirtualMode.getValidXmlResponse(),
                    "error": null
                }
            },
        ];
    }
}
