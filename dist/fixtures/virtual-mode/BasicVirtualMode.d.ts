import { INSiMockedResponse, INSiServiceFetchInsRequest, INSiServiceFormattedResponse, InsHisto, INSiServiceRequestEnv } from "../../models/insi-fetch-ins.models";
export default class BasicVirtualMode {
    static insHisto: InsHisto[];
    static personDetails: INSiServiceFormattedResponse;
    static fetchRequestFlow: INSiMockedResponse[];
    static getBuiltResponse(clientConfig: INSiServiceRequestEnv): INSiServiceFetchInsRequest[];
    private static _getXmlRequest;
    private static _getXmlInsHisto;
    private static _getValidXmlResponse;
    private static _getNoIdentityXmlResponse;
    private static _buildJsonResponse;
}
