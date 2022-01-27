export enum Gender {
  Male = 'M',
  Female = 'F',
}

export interface IINSiPersonData {
  formerName: string;
  firstName: string;
  gender: Gender;
  birthDate: string;
  birthPlaceInseeCode?: string;
}

export interface IINSiPersonSoapData {
  NomNaissance: string;
  Prenom: string;
  Sexe: Gender;
  DateNaissance: string; // YYYY-MM-DD
  LieuNaissance?: string; // COG
}

export class INSiPerson {
  formerName: string;
  firstName: string;
  gender: Gender;
  birthDate: string;
  birthPlaceInseeCode: string | undefined;

  constructor({ formerName, firstName, gender, birthDate, birthPlaceInseeCode }: IINSiPersonData) {
    if (!formerName) {
      throw new Error('Fail to create an INSiPerson, you must provide a formerName');
    }
    this.formerName = formerName;

    if (!firstName) {
      throw new Error('Fail to create an INSiPerson, you must provide a firstName');
    }
    this.firstName = firstName;

    if (!gender) {
      throw new Error('Fail to create an INSiPerson, you must provide a gender');
    }
    this.gender = gender;

    if (!this._isValidBirthDate(birthDate)) {
      throw new Error('Fail to create an INSiPerson, you must provide a valid birthDate');
    }
    this.birthDate = birthDate;

    this.birthPlaceInseeCode = birthPlaceInseeCode;
  }

  public getSoapDataAsJson(): IINSiPersonSoapData {
    return {
      NomNaissance: this.formerName,
      Prenom: this.firstName,
      Sexe: this.gender,
      DateNaissance: this.birthDate,
      ...(this.birthPlaceInseeCode ? { LieuNaissance: this.birthPlaceInseeCode } : {}),
    };
  }

  public _isValidBirthDate(birthDate: string) {
    if (!/\d{4}-\d{2}-\d{2}/.test(birthDate)) return false;
    return new Date(birthDate).toString() !== 'Invalid Date';
  }
}
