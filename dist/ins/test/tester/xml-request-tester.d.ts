import { INSiPersonArgs } from 'src/ins/class/insi-person.class';
import { INSiServiceFormattedResponse, InsHisto } from 'src/ins/models/insi-fetch-ins.models';
export declare const getXmlRequestTest: ({ idam, version, name, emitter, person, requestId, date }: {
    idam: string;
    version: string;
    name: string;
    emitter: string;
    person: INSiPersonArgs;
    requestId: string;
    date: string;
}) => string;
export declare const getNoIdentityXmlResponseTest: () => string;
export declare const getValidXmlResponseTest: (personDetails: INSiServiceFormattedResponse, insHisto?: InsHisto[]) => string;
