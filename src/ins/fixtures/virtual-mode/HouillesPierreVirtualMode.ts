import { Gender } from "../../class/insi-person.class";
import BasicVirtualMode from "./BasicVirtualMode";
import { CRCodes, CRLabels, INSiMockedResponse, INSiServiceFetchInsRequest, INSiServiceFormattedResponse, INSiServiceRequestEnv, INSiServiceRequestStatus, InsHisto } from '../../models/insi-fetch-ins.models';

export class HouillesPierreVirtualMode extends BasicVirtualMode {
  static insHisto: InsHisto[] = [];
  static personDetails: INSiServiceFormattedResponse = {
    firstName: '',
    birthName: 'HOUILLES',
    allFirstNames: 'PIERRE PAUL JACQUES',
    gender: Gender.Male,
    dateOfBirth: '1993-01-27',
  };
  static fetchRequestFlow: INSiMockedResponse[] = [{
    firstnameRequest: 'PIERRE',
    codeCR: CRCodes.NO_RESULT,
    LibelleCR: CRLabels.NO_RESULT,
  }, {
    firstnameRequest: 'PAUL',
    codeCR: CRCodes.NO_RESULT,
    LibelleCR: CRLabels.NO_RESULT,
  }, {
    firstnameRequest: 'JACQUES',
    codeCR: CRCodes.NO_RESULT,
    LibelleCR: CRLabels.NO_RESULT,
  }, {
    firstnameRequest: 'PIERRE PAUL JACQUES',
    codeCR: CRCodes.NO_RESULT,
    LibelleCR: CRLabels.NO_RESULT,
  }];
}
