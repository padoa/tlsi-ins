import { INSiPersonArgs } from "src/class/insi-person.class";
import { AdrunZoeVirtualMode } from "./AdrunZoeVirtualMode"
import { TchitchiOlaVirtualMode } from "./TchitchiOlaVirtualMode";
import { INSITestingUser, INSiServiceFetchInsRequest, INSiServiceRequestEnv } from "../../models/insi-fetch-ins.models";
import { DeVinciRuthVirtualMode } from "./DeVinciRuthVirtualMode";
import { HouillesPierreVirtualMode } from "./HouillesPierreVirtualMode";
import { CorseAnthonyVirtualMode } from "./CorseAnthonyVirtualMode";

export const getPersonMockedRequest = (person: INSiPersonArgs, requestId: string, {idam, version, name, requestDate}: INSiServiceRequestEnv): INSiServiceFetchInsRequest[] => {
    const formattedName = `${person.birthName} ${person.firstName}`.toLowerCase();
    let fetchRequests: INSiServiceFetchInsRequest[] = [];
    switch (formattedName) {
        case INSITestingUser.TCHITCHI:
            fetchRequests = TchitchiOlaVirtualMode.getMockedResponse(requestId, {idam, version, name, requestDate});
            break;
        case INSITestingUser.ADRUN:
            fetchRequests = AdrunZoeVirtualMode.getMockedResponse(requestId, {idam, version, name, requestDate});
            break;
        case INSITestingUser.CORSE:
            fetchRequests = CorseAnthonyVirtualMode.getMockedResponse(requestId, {idam, version, name, requestDate});
            break;
        case INSITestingUser.DEVINCI:
            fetchRequests = DeVinciRuthVirtualMode.getMockedResponse(requestId, {idam, version, name, requestDate});
            break;
        case INSITestingUser.HOUILLES:
            fetchRequests = HouillesPierreVirtualMode.getMockedResponse(requestId, {idam, version, name, requestDate});
            break;
        default:
            fetchRequests = [];
            break;
    }
    return fetchRequests;
}