import { Gender } from "../../class/insi-person.class";
import BasicVirtualMode from "./BasicVirtualMode";
import { CRCodes, CRLabels, INSiMockedResponse, INSiServiceFetchInsRequest, INSiServiceFormattedResponse, INSiServiceRequestEnv, INSiServiceRequestStatus, InsHisto } from "../../models/insi-fetch-ins.models";

export class EcetinsiPierreAlainVirtualMode extends BasicVirtualMode {
    static insHisto: InsHisto[] = [
        {
            IdIndividu: {
                NumIdentifiant: "2090763220834",
                Cle: "39",
                TypeMatricule: "NIR"
            },
            OID: "1.2.250.1.213.1.4.8"
        },
        {
            IdIndividu: {
                NumIdentifiant: "2090663220123",
                Cle: "55",
                TypeMatricule: "NIR"
            },
            OID: "1.2.250.1.213.1.4.8"
        }
    ];
    static personDetails: INSiServiceFormattedResponse = {
        firstName: 'PIERRE-ALAIN',
        birthName: 'ECETINSI',
        allFirstNames: 'PIERRE-ALAIN MURIEL FLORIANT',
        gender: Gender.Male,
        placeOfBirthCode: '63220',
        dateOfBirth: '2009-07-14',
        registrationNumber: '109076322083489',
        oid: '1.2.250.1.213.1.4.8',
    };
    static fetchRequestFlow: INSiMockedResponse[] = [{
        codeCR: CRCodes.OK,
        LibelleCR: CRLabels.OK,
        firstnameRequest: 'PIERRE-ALAIN',
    }];
}
