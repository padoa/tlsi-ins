import { INSiPersonArgs } from "src/class/insi-person.class";
import { AdrunZoeVirtualMode } from "./AdrunZoeVirtualMode"
import { TchitchiOlaVirtualMode } from "./TchitchiOlaVirtualMode";
import { INSITestingUser, INSiServiceFetchInsRequest } from "../../models/insi-fetch-ins.models";
import { DeVinciRuthVirtualMode } from "./DeVinciRuthVirtualMode";

export const getPersonVirtualMode = (person: INSiPersonArgs, requestId: string, {idam, version, name, requestDate}: any): any => {
    const formattedName = `${person.birthName} ${person.firstName}`.toLowerCase();
    let fetchRequests: INSiServiceFetchInsRequest[] = [];
    switch (formattedName) {
        case INSITestingUser.TCHITCHI:
            fetchRequests = TchitchiOlaVirtualMode.getMockedResponse(person, requestId, {idam, version, name, requestDate});
            break;
        case INSITestingUser.ADRUN:
            fetchRequests = AdrunZoeVirtualMode.getMockedResponse(person, requestId, {idam, version, name, requestDate});
            break;
        case INSITestingUser.DEVINCI:
            fetchRequests = DeVinciRuthVirtualMode.getMockedResponse(person, requestId, {idam, version, name, requestDate});
            break;
        default:
            fetchRequests = [];
            break;
    }
    return fetchRequests;
}