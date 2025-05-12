import { INSiServiceFormattedResponse, INSiServiceJsonResponse, INSiServiceResponse } from '../../models/insi-fetch-ins.models';
export declare const getAdrtroisToussaintXmlRequest: ({ idam, version, name, assertionPs }: {
    idam: string;
    version: string;
    name: string;
    assertionPs?: string | undefined;
}) => string;
export declare const getAdrtroisToussaintXmlResponse: () => string;
export declare const getAdrtroisToussaintRawResponse: () => INSiServiceJsonResponse;
export declare const getAdrtroisToussaintFormattedResponse: () => INSiServiceFormattedResponse;
export declare const getAdrtroisToussaintResponse: () => INSiServiceResponse;
