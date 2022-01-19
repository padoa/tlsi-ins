export enum Gender {
  Male = 'M',
  Female = 'F',
}

export interface IINSiPersonData {
  lastName: string;
  firstName: string;
  gender: Gender;
  dateOfBirth: string;
  birthPlaceCode?: string;
}

export interface IINSiPersonSoapData {
  NomNaissance: string;
  Prenom: string;
  Sexe: Gender;
  DateNaissance: string; // YYYY-MM-DD
  LieuNaissance?: string; // COG
}

export class INSiPerson {
  lastName: string;
  firstName: string;
  gender: Gender;
  dateOfBirth: string;
  birthPlaceCode: string | undefined;

  constructor({ lastName, firstName, gender, dateOfBirth, birthPlaceCode }: IINSiPersonData) {
    if (!lastName) {
      throw new Error('Fail to create an INSiPerson, you must provide a lastName');
    }
    this.lastName = lastName;

    if (!firstName) {
      throw new Error('Fail to create an INSiPerson, you must provide a firstName');
    }
    this.firstName = firstName;

    if (!gender) {
      throw new Error('Fail to create an INSiPerson, you must provide a gender');
    }
    this.gender = gender;

    if (!this._isValidBirthDate(dateOfBirth)) {
      throw new Error('Fail to create an INSiPerson, you must provide a valid dateOfBirth');
    }
    this.dateOfBirth = dateOfBirth;

    this.birthPlaceCode = birthPlaceCode;
  }

  public getSoapDataAsJson(): IINSiPersonSoapData {
    return {
      NomNaissance: this.lastName,
      Prenom: this.firstName,
      Sexe: this.gender,
      DateNaissance: this.dateOfBirth,
      ...(this.birthPlaceCode ? { LieuNaissance: this.birthPlaceCode } : {}),
    };
  }

  public _isValidBirthDate(birthDate: string) {
    if (!/\d{4}-\d{2}-\d{2}/.test(birthDate)) return false;
    return new Date(birthDate).toString() !== 'Invalid Date';
  }
}
