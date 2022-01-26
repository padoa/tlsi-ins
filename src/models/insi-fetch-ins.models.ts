import { Gender } from '../class/insi-person.class';

export interface INSiFetchInsResponse {
  requestId: string;
  formattedResponse: IFetchInsFormattedData;
  rawResponseAsJson: IFetchInsRawData;
  responseAsXMl: string;
  requestAsXML: string;
}

export interface IFetchInsRawData {
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

export interface IFetchInsFormattedData {
  formerName: string;
  firstName: string;
  firstNameList: string;
  gender: Gender;
  birthName: string;
  birthPlaceCode: string;
  socialSecurityNumber: string;
  oid: string;
}
