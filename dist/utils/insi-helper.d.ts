import { FetchInsBody, FetchInsRawBody } from '../models/insi-fetch-ins.models';
export declare class InsiHelper {
    static formatFetchINSResult(result: FetchInsRawBody): FetchInsBody | null;
    static changeInsHistoToArray(result: FetchInsRawBody): FetchInsRawBody;
}
