import { Gender } from '../class/insi-person.class';
export interface INSiFetchInsResponse {
    requestId: string;
    body: FetchInsBody | null;
    rawBody: FetchInsRawBody;
    bodyAsXMl: string;
    requestBodyAsXML: string;
    failedRequests?: INSiFetchInsResponse[];
}
export interface FetchInsRawBody {
    CR: {
        CodeCR: '00';
        LibelleCR: 'OK';
    };
    INDIVIDU: {
        INSACTIF: {
            IdIndividu: {
                NumIdentifiant: string;
                Cle: string;
            };
            OID: string;
        };
        TIQ: {
            NomNaissance: string;
            Prenom: string;
            ListePrenom: string;
            Sexe: Gender;
            DateNaissance: string;
            LieuNaissance: string;
        };
    };
}
export interface FetchInsBody {
    birthName: string;
    firstName: string;
    allFirstNames: string;
    gender: Gender;
    dateOfBirth: string;
    placeOfBirthCode: string;
    socialSecurityNumber: string;
    oid: string;
}
export declare const CR01_STAGING_ENV_CASES: string[];
export declare const getCR01XmlRequest: ({ idam, version, name, birthName, firstName, sexe, dateOfBirth }: {
    idam: string;
    version: string;
    name: string;
    birthName: string;
    firstName: string;
    sexe: Gender;
    dateOfBirth: string;
}) => string;
export declare const CR01Code = "01";
