import { INSiServiceFormattedResponse, INSiServiceJsonResponse, INSiServiceResponse } from '../../models/insi-fetch-ins.models';
export declare const getTchitchiOlaXmlRequest: ({ idam, version, name }: {
    idam: string;
    version: string;
    name: string;
}) => string;
export declare const getTchitchiCatarinaXmlRequest: ({ idam, version, name }: {
    idam: string;
    version: string;
    name: string;
}) => string;
export declare const getTchitchiCatarinaXmlResponse: () => string;
export declare const getTchitchiCatarinaJsonResponse: () => INSiServiceJsonResponse;
export declare const getTchitchiCatarinaFormattedResponse: () => INSiServiceFormattedResponse;
export declare const getTchitchiCatarinaResponse: () => INSiServiceResponse;
