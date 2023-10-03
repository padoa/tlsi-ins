import { Gender } from "../../class/insi-person.class";
import BasicVirtualMode from "./BasicVirtualMode";
import { CRCodes, CRLabels, INSiMockedResponse, INSiServiceFetchInsRequest, INSiServiceFormattedResponse, INSiServiceRequestEnv, INSiServiceRequestStatus, InsHisto } from "../../models/insi-fetch-ins.models";

export class HermanGatienVirtualMode extends BasicVirtualMode {
  static insHisto: InsHisto[] = [
    {
      IdIndividu: {
        NumIdentifiant: "1810363220456",
        Cle: "60"
      },
      OID: "1.2.250.1.213.1.4.8"
    },
    {
      IdIndividu: {
        NumIdentifiant: "2810363220456",
        Cle: "10"
      },
      OID: "1.2.250.1.213.1.4.8"
    }
  ];
  static personDetails: INSiServiceFormattedResponse = {
    firstName: 'GATIEN',
    birthName: 'HERMANN',
    allFirstNames: 'GATIEN',
    gender: Gender.Male,
    placeOfBirthCode: '63220',
    dateOfBirth: '1981-03-24',
    registrationNumber: '181036322045660',
    oid: '1.2.250.1.213.1.4.8',
  };
  static fetchRequestFlow: INSiMockedResponse[] = [{
    codeCR: CRCodes.OK,
    LibelleCR: CRLabels.OK,
    firstnameRequest: 'GATIEN',
  }];
}
