import { INSiPersonArgs } from "src/class/insi-person.class";
import { AdrunZoeVirtualMode } from "./AdrunZoeVirtualMode"
import { TchitchiOlaVirtualMode } from "./TchitchiOlaVirtualMode";
import { INSITestingUser, INSiServiceFetchInsRequest, INSiServiceRequestEnv } from "../../models/insi-fetch-ins.models";
import { HouillesPierreVirtualMode } from "./HouillesPierreVirtualMode";
import { CorseAnthonyVirtualMode } from "./CorseAnthonyVirtualMode";

export const getPersonMockedRequest = (person: INSiPersonArgs, requestId: string, {idam, version, name, requestDate, emitter}: INSiServiceRequestEnv): INSiServiceFetchInsRequest[] => {
    const formattedName = `${person.birthName} ${person.firstName}`.toLowerCase();
    const clientConfig =  {idam, version, name, requestId, requestDate, emitter};
    let fetchRequests: INSiServiceFetchInsRequest[] = [];
    switch (formattedName) {
        case INSITestingUser.TCHITCHI:
            fetchRequests = TchitchiOlaVirtualMode.getBuiltResponse(clientConfig);
            break;
        case INSITestingUser.ADRUN:
            fetchRequests = AdrunZoeVirtualMode.getBuiltResponse(clientConfig);
            break;
        case INSITestingUser.CORSE:
            fetchRequests = CorseAnthonyVirtualMode.getBuiltResponse(clientConfig);
            break;
        case INSITestingUser.HOUILLES:
            fetchRequests = HouillesPierreVirtualMode.getBuiltResponse(clientConfig);
            break;
        default:
            fetchRequests = [];
            break;
    }
    return fetchRequests;
}