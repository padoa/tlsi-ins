import { IFetchInsFormattedData, IFetchInsRawData } from '../models/insi-fetch-ins.models';

export class InsiHelper {
  public static formatFetchINSRawResponse(rawResponse: IFetchInsRawData): IFetchInsFormattedData {
    const { NumIdentifiant, Cle } = rawResponse.INDIVIDU.INSACTIF.IdIndividu;
    return {
      formerName: rawResponse.INDIVIDU.TIQ.NomNaissance,
      firstName: rawResponse.INDIVIDU.TIQ.Prenom,
      firstNameList: rawResponse.INDIVIDU.TIQ.ListePrenom,
      gender: rawResponse.INDIVIDU.TIQ.Sexe,
      birthName: rawResponse.INDIVIDU.TIQ.DateNaissance,
      birthPlaceCode: rawResponse.INDIVIDU.TIQ.LieuNaissance,
      socialSecurityNumber: `${NumIdentifiant}${Cle}`,
      oid: rawResponse.INDIVIDU.INSACTIF.OID,
    }
  }
}
