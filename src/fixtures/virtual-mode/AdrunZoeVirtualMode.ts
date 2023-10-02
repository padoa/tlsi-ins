import { Gender, INSiPersonArgs } from "../../class/insi-person.class";
import { getCNDAValidationXmlRequest } from "../insi-client.fixture";
import BasicVirtualMode from "./BasicVirtualMode";
import { CRCodes, CRLabels, INSiMockedResponse, INSiServiceFetchInsRequest, INSiServiceFormattedResponse, INSiServiceJsonResponse, INSiServiceRequestEnv, INSiServiceRequestStatus } from "../../models/insi-fetch-ins.models";
import { v4 as uuidv4 } from 'uuid';

export class AdrunZoeVirtualMode extends BasicVirtualMode {
    static getMockedResponse(requestId: string, { idam, version, name, requestDate }: INSiServiceRequestEnv): INSiServiceFetchInsRequest[] {
        const personDetails = {
            gender: Gender.Female,
            birthName: 'ADRUN',
            dateOfBirth: '1975-12-31',
        }
        const fetchRequestFlow: INSiMockedResponse[] = [{
            status: INSiServiceRequestStatus.SUCCESS,
            codeCR: CRCodes.OK,
            LibelleCR: CRLabels.OK,
            firstnameRequest: 'ZOE',
            formatted: {
                ...personDetails,
                oid: '1.2.250.1.213.1.4.8',
                firstName: 'ZOE',
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
        }];
        const adrunZoeVirtualMode = new AdrunZoeVirtualMode(fetchRequestFlow, personDetails);
        return adrunZoeVirtualMode.getBuiltResponse({ idam, version, name, requestId, requestDate });
    }
}
