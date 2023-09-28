import { INSiPersonArgs } from "src/class/insi-person.class";
import { INSiServiceFetchInsRequest, INSiServiceFormattedResponse, INSiServiceJsonResponse, INSiServiceRequestStatus } from "src/models/insi-fetch-ins.models";

export default abstract class BasicVirtualMode {
    abstract getXmlRequest(person: INSiPersonArgs, firstNameResquest:string, requestDate: string, requestId: string, { idam, version, name, assertionPs }: { idam: string, version: string, name: string, assertionPs?: string }): any;
    abstract getValidXmlResponse(): string;      
    abstract getFailedXmlResponse(): string;      
}