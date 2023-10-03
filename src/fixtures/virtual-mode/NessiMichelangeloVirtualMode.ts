import { Gender } from "../../class/insi-person.class";
import BasicVirtualMode from "./BasicVirtualMode";
import { CRCodes, CRLabels, INSiMockedResponse, INSiServiceFetchInsRequest, INSiServiceFormattedResponse, INSiServiceRequestEnv, INSiServiceRequestStatus, InsHisto } from "../../models/insi-fetch-ins.models";

export class NessiMichelangeloVirtualMode extends BasicVirtualMode {
    static insHisto: InsHisto[] = [];
    static personDetails: INSiServiceFormattedResponse = {
        firstName: 'MICHELANGELO',
        birthName: 'NESSI',
        allFirstNames: 'MICHELANGELO ANTHONY',
        gender: Gender.Male,
        placeOfBirthCode: '63220',
        dateOfBirth: '2010-08-07',
        registrationNumber: '110086322083060',
        oid: '1.2.250.1.213.1.4.8',
    };
    static fetchRequestFlow: INSiMockedResponse[] = [{
        codeCR: CRCodes.OK,
        LibelleCR: CRLabels.OK,
        firstnameRequest: 'MICHELANGELO',
    }];
}
