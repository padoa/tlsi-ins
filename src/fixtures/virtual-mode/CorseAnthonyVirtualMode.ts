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
}
