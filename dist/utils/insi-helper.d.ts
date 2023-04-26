import { INSiServiceError, INSiServiceFetchInsRequest, INSiServiceFormattedResponse, INSiServiceJsonResponse } from '../models/insi-fetch-ins.models';
export declare class InsiHelper {
    static formatFetchINSResult(result: INSiServiceJsonResponse): INSiServiceFormattedResponse | null;
    static changeInsHistoToArray(result: INSiServiceJsonResponse): INSiServiceJsonResponse;
    static getServiceErrorFromXML(xml: string): INSiServiceError | null;
    static checkIfRequestIsValid(request: INSiServiceFetchInsRequest): boolean;
}
