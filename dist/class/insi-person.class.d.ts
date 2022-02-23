export declare enum Gender {
    Male = "M",
    Female = "F"
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
    DateNaissance: string;
    LieuNaissance?: string;
}
export declare class INSiPerson {
    private readonly _person;
    constructor(personArgs: INSiPersonArgs);
    getSoapBodyAsJson(): INSiPersonSoapBody;
    _isValidBirthDate(dateOfBirth: string): boolean;
}
export {};