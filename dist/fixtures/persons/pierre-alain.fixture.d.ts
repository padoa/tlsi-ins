import { INSiServiceFormattedResponse, INSiServiceJsonResponse } from '../../models/insi-fetch-ins.models';
export declare const getPierreAlainXmlRequest: ({ idam, version, name }: {
    idam: string;
    version: string;
    name: string;
}) => string;
export declare const getPierreAlainXmlResponse: () => string;
export declare const getPierreAlainLiveXmlResponse: () => string;
export declare const getPierreAlainRawResponse: ({ liveVersion }?: {
    liveVersion?: boolean | undefined;
}) => INSiServiceJsonResponse;
export declare const getPierreAlainFormattedResponse: () => INSiServiceFormattedResponse;
