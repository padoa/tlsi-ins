import { Gender } from '../class/insi-person.class';
import { FetchInsBody, FetchInsRawBody } from '../models/insi-fetch-ins.models';
export declare const defaultUuid = "1f7425e2-b913-415c-adaa-785ee1076a70";
export declare const defaultDate = "2020-01-01";
export declare const getCR02XmlResponse: () => string;
export declare const getAdrtroisDominiqueXmlResponse: () => string;
export declare const getAdrtroisDominiqueXmlRequest: ({ idam, version, name }: {
    idam: string;
    version: string;
    name: string;
}) => string;
export declare const getAdrtroisDominiqueRawResponse: () => FetchInsRawBody;
export declare const getAdrtroisDominiqueFormattedResponse: () => FetchInsBody;
export declare const getTchitchiXmlResponse: () => string;
export declare const getTchitchiRawResponse: () => FetchInsRawBody;
export declare const getTchitchiFormattedResponse: () => FetchInsBody;
export declare const getCNDAValidationXmlRequest: ({ idam, version, name, birthName, firstName, sexe, dateOfBirth }: {
    idam: string;
    version: string;
    name: string;
    birthName: string;
    firstName: string;
    sexe: Gender;
    dateOfBirth: string;
}) => string;
export declare const getPierreAlainXmlResponse: () => string;
export declare const getPierreAlainLiveXmlResponse: () => string;
export declare const getPierreAlainRawResponse: ({ liveVersion }?: {
    liveVersion?: boolean | undefined;
}) => FetchInsRawBody;
export declare const getPierreAlainFormattedResponse: () => FetchInsBody;
