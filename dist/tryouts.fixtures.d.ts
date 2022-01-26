import { IFetchInsFormattedData, IFetchInsRawData } from './models/insi-fetch-ins.models';
export declare const getAdrtroisDominiqueXmlResponse: () => string;
export declare const getAdrtroisDominiqueXmlResquest: ({ idam, version, name }: {
    idam: string;
    version: string;
    name: string;
}) => string;
export declare const getAdrtroisDominiqueRawResponse: () => IFetchInsRawData;
export declare const getAdrtroisDominiqueFormattedResponse: () => IFetchInsFormattedData;
