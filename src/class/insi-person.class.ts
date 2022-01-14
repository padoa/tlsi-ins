import moment from 'moment';

export enum Gender {
  Male = 'M',
  Female = 'F',
}

export interface IINSiPersonData {
  lastName?: string,
  firstName?: string,
  gender?: Gender,
  dateOfBirth?: Date,
  birthPlaceCode?: string,
}

export interface IINSiPersonSoapData {
  NomNaissance?: string;
  Prenom?: string;
  Sexe?: string; // Code sexe
  DateNaissance?: string; // YYYY-MM-DD
  LieuNaissance?: string; // COG
}

export class INSiPerson {
  lastName: string | undefined;
  firstName: string | undefined;
  gender: Gender | undefined;
  dateOfBirth: Date | undefined;
  birthPlaceCode: string | undefined;

  constructor({ lastName, firstName, gender, dateOfBirth, birthPlaceCode }: IINSiPersonData) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.gender = gender;
    this.dateOfBirth = dateOfBirth;
    this.birthPlaceCode = birthPlaceCode;
  }

  public getSoapData(): IINSiPersonSoapData {
    return {
      NomNaissance: this.lastName,
      Prenom: this.firstName,
      Sexe: this.gender,
      DateNaissance: moment(this.dateOfBirth).format('YYYY-MM-DD'),
      LieuNaissance: this.birthPlaceCode,
    };
  }
}
