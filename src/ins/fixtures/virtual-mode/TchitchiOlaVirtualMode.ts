import { Gender, INSiPersonArgs } from "../../class/insi-person.class";
import BasicVirtualMode from "./BasicVirtualMode";
import { CRCodes, CRLabels, INSiMockedResponse, INSiServiceFetchInsRequest, INSiServiceFormattedResponse, INSiServiceJsonResponse, INSiServiceRequestEnv, INSiServiceRequestStatus, InsHisto } from '../../models/insi-fetch-ins.models';
import _ from "lodash";

export class TchitchiOlaVirtualMode extends BasicVirtualMode {
  static insHisto: InsHisto[] = [];
  static personDetails: INSiServiceFormattedResponse = {
    firstName: 'CATARINA',
    birthName: 'TCHITCHI',
    allFirstNames: 'CATARINA BELLA',
    gender: Gender.Female,
    placeOfBirthCode: '63220',
    dateOfBirth: '1936-06-21',
    registrationNumber: '236066322083656',
    oid: '1.2.250.1.213.1.4.8',
  };
  static fetchRequestFlow: INSiMockedResponse[] = [{
    codeCR: CRCodes.NO_RESULT,
    LibelleCR: CRLabels.NO_RESULT,
    firstnameRequest: 'OLA',
  }, {
    codeCR: CRCodes.OK,
    LibelleCR: CRLabels.OK,
    firstnameRequest: 'CATARINA',
  }];
}
