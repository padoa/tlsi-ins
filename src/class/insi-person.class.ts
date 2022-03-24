import { CR01_STAGING_ENV_CASES } from "../models/insi-fetch-ins.models";

export enum Gender {
  Male = 'M',
  Female = 'F',
}

export interface INSiPersonArgs {
  birthName: string;
  firstName: string;
  gender: Gender;
  dateOfBirth: string;
  placeOfBirthCode?: string;
}

interface INSiPersonSoapBody {
  NomNaissance: string;
  Prenom: string;
  Sexe: Gender;
  DateNaissance: string; // YYYY-MM-DD
  LieuNaissance?: string; // COG
}

export class INSiPerson {
  private readonly _person: INSiPersonArgs;

  constructor(personArgs: INSiPersonArgs) {
    if (!personArgs.birthName) {
      throw new Error('Fail to create an INSiPerson, you must provide a birthName');
    }
    if (!this._isValidName(personArgs.birthName)) {
      throw new Error('Fail to create an INSiPerson, the birthName you provided is not in the correct format');
    }
    if (!personArgs.firstName) {
      throw new Error('Fail to create an INSiPerson, you must provide a firstName');
    }
    if (!this._isValidName(personArgs.firstName)) {
      throw new Error('Fail to create an INSiPerson, the firstName you provided is not in the correct format');
    }
    if (!personArgs.gender) {
      throw new Error('Fail to create an INSiPerson, you must provide a gender');
    }
    if (!this._isValidBirthDate(personArgs.dateOfBirth)) {
      throw new Error('Fail to create an INSiPerson, you must provide a valid dateOfBirth');
    }
    this._person = personArgs;
  }

  public getSoapBodyAsJson(): INSiPersonSoapBody {
    const { birthName, firstName, gender, dateOfBirth, placeOfBirthCode } = this._person;
    return {
      NomNaissance: birthName,
      Prenom: firstName,
      Sexe: gender,
      DateNaissance: dateOfBirth,
      ...(placeOfBirthCode ? { LieuNaissance: placeOfBirthCode } : {}),
    };
  }

  public getPerson(): INSiPersonArgs {
    return this._person;
  }

  public _isValidBirthDate(dateOfBirth: string): boolean {
    if (!/\d{4}-\d{2}-\d{2}/.test(dateOfBirth)) return false;
    return new Date(dateOfBirth).toString() !== 'Invalid Date';
  }

  public _isValidName(name: string): boolean {
    return /^[A-Z]+(?:(?:-{1,2}|[' ])[A-Z]+)*$/.test(name);
  }

  public isCR01SpecialCase(): boolean {
    return CR01_STAGING_ENV_CASES.includes(this._person.birthName);
  }
}
