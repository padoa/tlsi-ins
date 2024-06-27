import {
  CRCodes,
  INSiServiceError,
  INSiServiceFetchInsRequest,
  INSiServiceFormattedResponse,
  INSiServiceJsonResponse,
  INSiServiceRequestStatus,
} from '../models/insi-fetch-ins.models';
import _ from 'lodash';

export class InsiHelper {
  public static formatFetchINSResult(result: INSiServiceJsonResponse): Partial<INSiServiceFormattedResponse> | null {
    if (!result.INDIVIDU) {
      return null;
    }
    const ListePrenom = result.INDIVIDU?.TIQ?.ListePrenom;
    const NumIdentifiant = result.INDIVIDU?.INSACTIF?.IdIndividu?.NumIdentifiant;
    const Cle = result.INDIVIDU?.INSACTIF?.IdIndividu?.Cle;
    return {
      birthName: result.INDIVIDU?.TIQ?.NomNaissance,
      firstName: ListePrenom ? ListePrenom.split(' ')?.[0] : undefined,
      allFirstNames: result.INDIVIDU?.TIQ?.ListePrenom,
      gender: result.INDIVIDU?.TIQ?.Sexe,
      dateOfBirth: result.INDIVIDU?.TIQ?.DateNaissance,
      placeOfBirthCode: result.INDIVIDU?.TIQ?.LieuNaissance,
      registrationNumber: NumIdentifiant && Cle ? `${NumIdentifiant}${Cle}` : undefined,
      oid: result.INDIVIDU?.INSACTIF?.OID,
    }
  }

  public static changeInsHistoToArray(result: INSiServiceJsonResponse): INSiServiceJsonResponse {
    if (result?.INDIVIDU?.INSHISTO && !_.isArray(result?.INDIVIDU?.INSHISTO)) {
      result.INDIVIDU.INSHISTO = [result.INDIVIDU.INSHISTO];
    }
    return result;
  }

  public static getServiceErrorFromXML(xml: string): INSiServiceError | null {
    try {
      return {
        siramCode: xml.match(/(<S:Subcode><S:Value>S:)(.*)(<\/S:Value>)/)?.[2],
        text: xml.match(/(<S:Text xml:lang="en">)([\S\s]*?)(<\/S:Text>)/)?.[2],
        desirCode: xml.match(/(code=")(.*?)(")/)?.[2],
        error: xml.match(/(<siram:Erreur(.*)>)([\S\s]*)(<\/siram:Erreur>)/)?.[3],
      };
    } catch {
      return null;
    }
  }

  public static checkIfRequestIsValid(request: INSiServiceFetchInsRequest): boolean {
    const requestIsSuccessful = request.status === INSiServiceRequestStatus.SUCCESS;
    const requestReturnData = request.response.json?.CR.CodeCR === CRCodes.OK;
    const requestDataIsComplete = _.compact(_.values(request.response.formatted)).length === 8;
    return requestIsSuccessful && requestReturnData && requestDataIsComplete;
  }
}
