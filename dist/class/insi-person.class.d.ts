export declare enum Gender {
    Male = "M",
    Female = "F"
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
    DateNaissance: string;
    LieuNaissance?: string;
}
export declare class INSiPerson {
    lastName: string;
    firstName: string;
    gender: Gender;
    dateOfBirth: string;
    birthPlaceCode: string | undefined;
    constructor({ lastName, firstName, gender, dateOfBirth, birthPlaceCode }: IINSiPersonData);
    getSoapDataAsJson(): IINSiPersonSoapData;
    _isValidBirthDate(birthDate: string): boolean;
}
