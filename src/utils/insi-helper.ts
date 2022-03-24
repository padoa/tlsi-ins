import { FetchInsBody, FetchInsRawBody } from '../models/insi-fetch-ins.models';

export class InsiHelper {
  public static formatFetchINSRawResponse(rawResponse: FetchInsRawBody): FetchInsBody | null {
    if (!rawResponse.INDIVIDU) {
      return null;
    }
    const { NumIdentifiant, Cle } = rawResponse.INDIVIDU.INSACTIF.IdIndividu;
    return {
      birthName: rawResponse.INDIVIDU.TIQ.NomNaissance,
      firstName: rawResponse.INDIVIDU.TIQ.Prenom,
      allFirstNames: rawResponse.INDIVIDU.TIQ.ListePrenom,
      gender: rawResponse.INDIVIDU.TIQ.Sexe,
      dateOfBirth: rawResponse.INDIVIDU.TIQ.DateNaissance,
      placeOfBirthCode: rawResponse.INDIVIDU.TIQ.LieuNaissance,
      socialSecurityNumber: `${NumIdentifiant}${Cle}`,
      oid: rawResponse.INDIVIDU.INSACTIF.OID,
    }
  }
}
