import { Gender } from "../../class/insi-person.class";
import BasicVirtualMode from "./BasicVirtualMode";
import { CRCodes, CRLabels, INSiMockedResponse, INSiServiceFetchInsRequest, INSiServiceRequestEnv, INSiServiceRequestStatus } from '../../models/insi-fetch-ins.models';

export class TchitchiOlaVirtualMode extends BasicVirtualMode {
    static getMockedResponse(requestId: string, { idam, version, name, requestDate }: INSiServiceRequestEnv): INSiServiceFetchInsRequest[] {
        const personDetails = {
            birthName: 'TCHITCHI',
            gender: Gender.Female,
            dateOfBirth: '1936-06-21',
        }
        const fetchRequestFlow: INSiMockedResponse[] = [{
            status: INSiServiceRequestStatus.SUCCESS,
            firstnameRequest: 'OLA',
            codeCR: CRCodes.NO_RESULT,
            LibelleCR: CRLabels.NO_RESULT,
        }, {
            status: INSiServiceRequestStatus.SUCCESS,
            codeCR: CRCodes.OK,
            LibelleCR: CRLabels.OK,
            firstnameRequest: 'CATARINA',
            formatted: {
                ...personDetails,
                firstName: 'CATARINA',
                allFirstNames: 'CATARINA BELLA',
                placeOfBirthCode: '63220',
                registrationNumber: '236066322083656',
                oid: '1.2.250.1.213.1.4.8',
            },
            json: {
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
            } 
        },
    ]
    const tchitchiOlaVirtualMode = new TchitchiOlaVirtualMode(fetchRequestFlow, personDetails);
    return tchitchiOlaVirtualMode.getBuiltResponse({ idam, version, name, requestId, requestDate });
}
}
