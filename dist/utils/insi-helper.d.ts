import { FetchInsBody, FetchInsRawBody, INSiServiceError } from '../models/insi-fetch-ins.models';
export declare class InsiHelper {
    static formatFetchINSResult(result: FetchInsRawBody): FetchInsBody | null;
    static changeInsHistoToArray(result: FetchInsRawBody): FetchInsRawBody;
    static getServiceErrorFromXML(xml: string): INSiServiceError | null;
}
