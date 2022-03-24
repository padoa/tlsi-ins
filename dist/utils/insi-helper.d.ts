import { FetchInsBody, FetchInsRawBody } from '../models/insi-fetch-ins.models';
export declare class InsiHelper {
    static formatFetchINSRawResponse(rawResponse: FetchInsRawBody): FetchInsBody | null;
}
