import BasicVirtualMode from "./BasicVirtualMode";
import { INSiMockedResponse, INSiServiceFormattedResponse, InsHisto } from "../../models/insi-fetch-ins.models";
export declare class HermanGatienVirtualMode extends BasicVirtualMode {
    static insHisto: InsHisto[];
    static personDetails: INSiServiceFormattedResponse;
    static fetchRequestFlow: INSiMockedResponse[];
}
