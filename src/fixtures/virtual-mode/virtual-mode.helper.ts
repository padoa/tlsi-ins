import { INSiPersonArgs } from "src/class/insi-person.class";
import { AdrunZoeVirtualMode } from "./AdrunZoeVirtualMode"
import { TchitchiOlaVirtualMode } from "./TchitchiOlaVirtualMode";
import { INSITestingUser, INSiServiceFetchInsRequest, INSiServiceRequestEnv } from "../../models/insi-fetch-ins.models";
import { HouillesPierreVirtualMode } from "./HouillesPierreVirtualMode";
import { CorseAnthonyVirtualMode } from "./CorseAnthonyVirtualMode";
import { EcetinsiPierreAlainVirtualMode } from "./EcetinsiPierreAlainVirtualMode";
import { HermanGatienVirtualMode } from "./HermanGatienVirtualMode";
import { NessiMichelangeloVirtualMode } from "./NessiMichelangeloVirtualMode";

export const getPersonMockedRequest = (person: INSiPersonArgs, clientConfig: INSiServiceRequestEnv): INSiServiceFetchInsRequest[] => {
  const formattedName = `${person.birthName} ${person.firstName}`.toLowerCase();
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
        case INSITestingUser.ECETINSI:
            fetchRequests = EcetinsiPierreAlainVirtualMode.getBuiltResponse(clientConfig);
            break;
        case INSITestingUser.HERMAN:
            fetchRequests = HermanGatienVirtualMode.getBuiltResponse(clientConfig);
            break;
        case INSITestingUser.NESSIMICHELANGELO:
            fetchRequests = NessiMichelangeloVirtualMode.getBuiltResponse(clientConfig);
            break;
        default:
            fetchRequests = [];
            break;
  }
    return fetchRequests;
}
