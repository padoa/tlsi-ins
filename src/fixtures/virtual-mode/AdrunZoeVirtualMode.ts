import { Gender } from "../../class/insi-person.class";
import BasicVirtualMode from "./BasicVirtualMode";
import { CRCodes, CRLabels, INSiMockedResponse, INSiServiceFetchInsRequest, INSiServiceFormattedResponse, INSiServiceRequestEnv, INSiServiceRequestStatus, InsHisto } from "../../models/insi-fetch-ins.models";

export class AdrunZoeVirtualMode extends BasicVirtualMode {
  static insHisto: InsHisto[] = [];
  static personDetails: INSiServiceFormattedResponse = {
    firstName: 'ZOE',
    birthName: 'ADRUN',
    allFirstNames: 'ZOE',
    gender: Gender.Female,
    placeOfBirthCode: '63220',
    dateOfBirth: '1975-12-31',
    registrationNumber: '275126322074974',
    oid: '1.2.250.1.213.1.4.8',
  };
  static fetchRequestFlow: INSiMockedResponse[] = [{
    codeCR: CRCodes.OK,
    LibelleCR: CRLabels.OK,
    firstnameRequest: 'ZOE',
  }];
}
