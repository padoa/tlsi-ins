import { Gender } from '../class/insi-person.class';

export interface INSiFetchInsResponse {
  status: INSiServiceRequestStatus,
  requestId: string;
  response: FetchInsBody | null;
  responseBodyAsJson: FetchInsRawBody | null;
  responseBodyAsXml: string;
  requestBodyAsXML: string;
  error: INSiServiceError | null,
}

export interface INSiServiceError {
  siramCode: string | undefined;
  text: string | undefined;
  desirCode: string | undefined;
  error: string | undefined;
}

export enum INSiServiceRequestStatus {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
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
  DateDeb?: string,
  DateFin?: string,
  IdIndividu: {
    Cle: string,
    NumIdentifiant: string,
    TypeMatricule?: string,
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
