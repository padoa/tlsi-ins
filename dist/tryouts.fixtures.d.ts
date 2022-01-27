import { FetchInsBody, FetchInsRawBody } from './models/insi-fetch-ins.models';
export declare const getAdrtroisDominiqueXmlResponse: () => string;
export declare const getAdrtroisDominiqueXmlResquest: ({ idam, version, name }: {
    idam: string;
    version: string;
    name: string;
}) => string;
export declare const getAdrtroisDominiqueRawResponse: () => FetchInsRawBody;
export declare const getAdrtroisDominiqueFormattedResponse: () => FetchInsBody;
