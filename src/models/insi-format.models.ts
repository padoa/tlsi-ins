import { Gender } from '../class/insi-person.class';

export interface INSiSearchFromIdentityTraits {
  requestId: string;
  responseAsJson: IFetchIdentityResponse;
  responseAsXMl: string;
  requestAsXML: string;
}

// Trait d'identification
export interface TIQ {
  NomNaissance: string;
  Prenom: string;
  ListePrenom: string;
  Sexe: Gender;
  DateNaissance: string; // YYYY-MM-DD
  LieuNaissance: string;
}

export interface INSACTIF {
  IdIndividu: {
    NumIdentifiant: string;
    Cle: string;
  },
  OID: string;
}

export interface IFetchIdentityResponse {
  CR: {
    CodeCR: '00',
    LibelleCR: 'OK'
  },
  INDIVIDU: {
    INSACTIF: INSACTIF,
    TIQ: TIQ;
  }
}

