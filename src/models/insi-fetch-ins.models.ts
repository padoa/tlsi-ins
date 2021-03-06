import { Gender } from '../class/insi-person.class';

export interface INSiFetchInsResponse {
  requestId: string;
  body: FetchInsBody | null;
  rawBody: FetchInsRawBody;
  bodyAsXMl: string;
  requestBodyAsXML: string;
  failedRequests?: INSiFetchInsResponse[];
}

export enum CRCodes {
  OK = '00',
  NO_RESULT = '01',
  MULTIPLE_MATCHES = '02',
}

export enum CRLabels {
  OK = 'OK',
  NO_RESULT = 'Aucune identite trouvee',
  MULTIPLE_MATCHES = 'Plusieurs identites trouvees',
}

interface InsHisto {
  IdIndividu: {
    Cle: string,
    NumIdentifiant: string,
    TypeMatricule: string,
  },
  OID: string,
}

export interface FetchInsRawBody {
  CR: {
    CodeCR: CRCodes.OK,
    LibelleCR: CRLabels.OK,
  } | {
    CodeCR: CRCodes.NO_RESULT,
    LibelleCR: CRLabels.NO_RESULT,
  } | {
    CodeCR: CRCodes.MULTIPLE_MATCHES,
    LibelleCR: CRLabels.MULTIPLE_MATCHES,
  },
  INDIVIDU: {
    INSACTIF: {
      IdIndividu: {
        NumIdentifiant: string;
        Cle: string;
      },
      OID: string;
    },
    INSHISTO?: InsHisto[],
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
