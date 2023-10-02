import { Gender } from "../../class/insi-person.class";
import BasicVirtualMode from "./BasicVirtualMode";
import { CRCodes, CRLabels, INSiMockedResponse, INSiServiceFetchInsRequest, INSiServiceFormattedResponse, INSiServiceRequestEnv, INSiServiceRequestStatus, InsHisto } from "../../models/insi-fetch-ins.models";

export class CorseAnthonyVirtualMode extends BasicVirtualMode {
    static insHisto: InsHisto[] = [
        {
            IdIndividu: {
                NumIdentifiant: "180032B020401",
                Cle: "23"
            },
            OID: "1.2.250.1.213.1.4.8"
        }
    ];
    static personDetails: INSiServiceFormattedResponse = {
        firstName: 'ANTHONY',
        birthName: 'CORSE',
        allFirstNames: 'ANTHONY',
        gender: Gender.Male,
        placeOfBirthCode: '2B020',
        dateOfBirth: '1980-03-02',
        registrationNumber: '180032B02040123',
        oid: '1.2.250.1.213.1.4.8',
    };
    static fetchRequestFlow: INSiMockedResponse[] = [{
        codeCR: CRCodes.OK,
        LibelleCR: CRLabels.OK,
        firstnameRequest: 'ANTHONY',
    }];

    /* static getMockedResponse(requestId: string, { idam, version, name, requestDate, emitter }: INSiServiceRequestEnv): INSiServiceFetchInsRequest[] {
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
        return corseAnthonyVirtualMode.getBuiltResponse({ idam, version, name, requestId, requestDate, emitter });
    } */
}
