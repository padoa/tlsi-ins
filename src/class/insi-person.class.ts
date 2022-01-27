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
    if (!personArgs.firstName) {
      throw new Error('Fail to create an INSiPerson, you must provide a firstName');
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

  public _isValidBirthDate(dateOfBirth: string) {
    if (!/\d{4}-\d{2}-\d{2}/.test(dateOfBirth)) return false;
    return new Date(dateOfBirth).toString() !== 'Invalid Date';
  }
}
