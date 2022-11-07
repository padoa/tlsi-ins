import { FetchInsBody, FetchInsRawBody, INSiServiceError } from '../models/insi-fetch-ins.models';
import _ from 'lodash';

export class InsiHelper {
  public static formatFetchINSResult(result: FetchInsRawBody): FetchInsBody | null {
    if (!result.INDIVIDU) {
      return null;
    }
    const { NumIdentifiant, Cle } = result.INDIVIDU.INSACTIF.IdIndividu;
    return {
      birthName: result.INDIVIDU.TIQ.NomNaissance,
      firstName: result.INDIVIDU.TIQ.ListePrenom.split(' ')?.[0],
      allFirstNames: result.INDIVIDU.TIQ.ListePrenom,
      gender: result.INDIVIDU.TIQ.Sexe,
      dateOfBirth: result.INDIVIDU.TIQ.DateNaissance,
      placeOfBirthCode: result.INDIVIDU.TIQ.LieuNaissance,
      socialSecurityNumber: `${NumIdentifiant}${Cle}`,
      oid: result.INDIVIDU.INSACTIF.OID,
    }
  }

  public static changeInsHistoToArray(result: FetchInsRawBody): FetchInsRawBody {
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
}
