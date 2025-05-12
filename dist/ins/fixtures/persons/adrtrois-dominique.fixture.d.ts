import { INSiServiceFormattedResponse, INSiServiceJsonResponse, INSiServiceResponse } from '../../models/insi-fetch-ins.models';
export declare const getAdrtroisDominiqueXmlRequest: ({ idam, version, name }: {
    idam: string;
    version: string;
    name: string;
}) => string;
export declare const getAdrtroisDominiqueXmlResponse: () => string;
export declare const getAdrtroisDominiqueRawResponse: () => INSiServiceJsonResponse;
export declare const getAdrtroisDominiqueFormattedResponse: () => INSiServiceFormattedResponse;
export declare const getAdrtroisDominiqueResponse: () => INSiServiceResponse;
