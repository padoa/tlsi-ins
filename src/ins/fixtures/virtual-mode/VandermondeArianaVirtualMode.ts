import { Gender } from "../../class/insi-person.class";
import BasicVirtualMode from "./BasicVirtualMode";
import { CRCodes, CRLabels, INSiMockedErrorResponse, INSiMockedResponse, INSiServiceFetchInsRequest, INSiServiceFormattedResponse, INSiServiceRequestEnv, INSiServiceRequestStatus, INSiServiceResponse, InsHisto } from '../../models/insi-fetch-ins.models';

export class VandermondeArianaVirtualMode extends BasicVirtualMode {
  static insHisto: InsHisto[] = [];
  static personDetails: INSiServiceFormattedResponse = {
    firstName: 'ARIANA',
    birthName: 'VANDERMONDE',
    allFirstNames: 'ARIANA',
    gender: Gender.Female,
    dateOfBirth: '1995-06-17',
    placeOfBirthCode: '77284',
  };
  static fetchErrorRequest: INSiMockedErrorResponse[] = [{
    firstnameRequest: 'ARIANA',
    error: {
        text:"Le service est temporairement inaccessible. Veuillez renouveler votre demande ultérieurement. Si le problème persiste, contactez l'éditeur du progiciel ou votre responsable informatique.",
        error:"L'appel au service de recherche avec les traits d'identité renvoie une erreur technique.",
        desirCode:"insi_102",
        siramCode:"siram_40"
     },
  }];
}
