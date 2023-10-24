import { INSiPersonArgs } from "src/class/insi-person.class";
import { INSiServiceFormattedResponse, InsHisto } from "src/models/insi-fetch-ins.models";
export declare const getXmlRequestTest: ({ idam, version, name, person, requestId }: {
    idam: string;
    version: string;
    name: string;
    person: INSiPersonArgs;
    requestId: string;
}) => string;
export declare const getNoIdentityXmlResponseTest: () => string;
export declare const getValidXmlResponseTest: (personDetails: INSiServiceFormattedResponse, insHisto?: InsHisto[]) => string;
