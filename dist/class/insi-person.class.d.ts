export declare enum Gender {
    Male = "M",
    Female = "F"
}
export interface IINSiPersonData {
    formerName: string;
    firstName: string;
    gender: Gender;
    birthDate: string;
    birthPlaceCode?: string;
}
export interface IINSiPersonSoapData {
    NomNaissance: string;
    Prenom: string;
    Sexe: Gender;
    DateNaissance: string;
    LieuNaissance?: string;
}
export declare class INSiPerson {
    formerName: string;
    firstName: string;
    gender: Gender;
    birthDate: string;
    birthPlaceCode: string | undefined;
    constructor({ formerName, firstName, gender, birthDate, birthPlaceCode }: IINSiPersonData);
    getSoapDataAsJson(): IINSiPersonSoapData;
    _isValidBirthDate(birthDate: string): boolean;
}
