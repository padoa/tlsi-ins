import { Gender, INSiPersonArgs } from "../../class/insi-person.class";
import { getCNDAValidationXmlRequest } from "../insi-client.fixture";
import BasicVirtualMode from "./BasicVirtualMode";
import { CRCodes, CRLabels, INSiMockedResponse, INSiServiceFetchInsRequest, INSiServiceRequestEnv, INSiServiceRequestStatus } from "../../models/insi-fetch-ins.models";

export class CorseAnthonyVirtualMode extends BasicVirtualMode {
    static getMockedResponse(requestId: string, { idam, version, name, requestDate }: INSiServiceRequestEnv): INSiServiceFetchInsRequest[] {
        const personDetails = {
            gender: Gender.Male,
            birthName: 'CORSE',
            dateOfBirth: '1980-03-02',
        }
        const fetchRequestFlow: INSiMockedResponse[] = [{
            status: INSiServiceRequestStatus.SUCCESS,
            codeCR: CRCodes.OK,
            LibelleCR: CRLabels.OK,
            firstnameRequest: 'ANTHONY',
            formatted: {
                ...personDetails,
                oid: '1.2.250.1.213.1.4.8',
                firstName: 'ANTHONY',
                allFirstNames: 'ANTHONY',
                placeOfBirthCode: '2B020',
                registrationNumber: '180032B02040123',
            },
            json: {
                CR: {
                    CodeCR: CRCodes.OK,
                    LibelleCR: CRLabels.OK
                },
                INDIVIDU: {
                    INSACTIF: {
                        IdIndividu: {
                            NumIdentifiant: "180032B020401",
                            Cle: "23"
                        },
                        OID: "1.2.250.1.213.1.4.8"
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
                        NomNaissance: "CORSE",
                        Prenom: "ANTHONY",
                        ListePrenom: "ANTHONY",
                        Sexe: Gender.Male,
                        DateNaissance: "1980-03-02",
                        LieuNaissance: "2B020"
                    }
                }
            },
        }];
        const corseAnthonyVirtualMode = new CorseAnthonyVirtualMode(fetchRequestFlow, personDetails);
        return corseAnthonyVirtualMode.getBuiltResponse({ idam, version, name, requestId, requestDate });
    }
}
