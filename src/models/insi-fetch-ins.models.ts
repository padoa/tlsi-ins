import { Gender } from '../class/insi-person.class';

export interface INSiFetchInsResponse {
  requestId: string;
  body: FetchInsBody;
  rawBody: FetchInsRawBody;
  bodyAsXMl: string;
  requestBodyAsXML: string;
}

export interface FetchInsRawBody {
  CR: {
    CodeCR: '00',
    LibelleCR: 'OK'
  },
  INDIVIDU: {
    INSACTIF: {
      IdIndividu: {
        NumIdentifiant: string;
        Cle: string;
      },
      OID: string;
    },
    TIQ: {
      NomNaissance: string;
      Prenom: string;
      ListePrenom: string;
      Sexe: Gender;
      DateNaissance: string; // YYYY-MM-DD
      LieuNaissance: string;
    };
  }
}

export interface FetchInsBody {
  birthName: string;
  firstName: string;
  allFirstNames: string;
  gender: Gender;
  // Date of birth of the subject as YYYY-MM-DD (ex: 1997-02-26)
  dateOfBirth: string;
  placeOfBirthCode: string;
  socialSecurityNumber: string;
  oid: string;
}
