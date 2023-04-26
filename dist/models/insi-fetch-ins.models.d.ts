import { Gender } from '../class/insi-person.class';
export interface INSiServiceFetchInsResult {
    successRequest: INSiServiceFetchInsRequest | null;
    failedRequests: INSiServiceFetchInsRequest[];
}
export interface INSiServiceFetchInsRequest {
    status: INSiServiceRequestStatus;
    request: INSiServiceRequest;
    response: INSiServiceResponse;
}
export interface INSiServiceRequest {
    id: string;
    xml: string;
}
export interface INSiServiceResponse {
    formatted: INSiServiceFormattedResponse | null;
    json: INSiServiceJsonResponse | null;
    xml: string;
    error: INSiServiceError | null;
}
export interface INSiServiceError {
    siramCode: string | undefined;
    text: string | undefined;
    desirCode: string | undefined;
    error: string | undefined;
}
export declare enum INSiServiceRequestStatus {
    SUCCESS = "SUCCESS",
    FAIL = "FAIL"
}
export declare enum CRCodes {
    OK = "00",
    NO_RESULT = "01",
    MULTIPLE_MATCHES = "02"
}
export declare enum CRLabels {
    OK = "OK",
    NO_RESULT = "Aucune identite trouvee",
    MULTIPLE_MATCHES = "Plusieurs identites trouvees"
}
interface InsHisto {
    DateDeb?: string;
    DateFin?: string;
    IdIndividu: {
        Cle: string;
        NumIdentifiant: string;
        TypeMatricule?: string;
    };
    OID: string;
}
export interface INSiServiceJsonResponse {
    CR: {
        CodeCR: CRCodes.OK;
        LibelleCR: CRLabels.OK;
    } | {
        CodeCR: CRCodes.NO_RESULT;
        LibelleCR: CRLabels.NO_RESULT;
    } | {
        CodeCR: CRCodes.MULTIPLE_MATCHES;
        LibelleCR: CRLabels.MULTIPLE_MATCHES;
    };
    INDIVIDU?: {
        INSACTIF?: {
            IdIndividu?: {
                NumIdentifiant?: string;
                Cle?: string;
            };
            OID?: string;
        };
        INSHISTO?: InsHisto[];
        TIQ?: {
            NomNaissance?: string;
            ListePrenom?: string;
            Sexe?: Gender;
            DateNaissance?: string;
            LieuNaissance?: string;
        };
    };
}
export interface INSiServiceFormattedResponse {
    birthName?: string;
    firstName?: string;
    allFirstNames?: string;
    gender?: Gender;
    dateOfBirth?: string;
    placeOfBirthCode?: string;
    registrationNumber?: string;
    oid?: string;
}
export {};
