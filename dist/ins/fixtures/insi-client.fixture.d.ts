import { Gender } from '../class/insi-person.class';
export declare const defaultUuid = "1f7425e2-b913-415c-adaa-785ee1076a70";
export declare const defaultDate = "2020-01-01";
export declare const getCR02XmlResponse: () => string;
export interface IGetCNDAXmlRequestParams {
    idam: string;
    version: string;
    name: string;
    birthName: string;
    firstName: string;
    gender: Gender;
    dateOfBirth: string;
    assertionPs?: string;
}
export declare const getCNDAValidationXmlRequest: ({ idam, version, name, birthName, firstName, gender, dateOfBirth, assertionPs }: IGetCNDAXmlRequestParams) => string;
export declare const getSecurityXmlForRequest: (assertionPs: string) => string;
