import { IFetchIdentityResponse } from './models/insi-format.models';
export declare const getAdrtroisDominiqueXmlResponse: () => string;
export declare const getAdrtroisDominiqueXmlResquest: ({ idam, version, name }: {
    idam: string;
    version: string;
    name: string;
}) => string;
export declare const getAdrtroisDominiqueJsonResponse: () => IFetchIdentityResponse;
