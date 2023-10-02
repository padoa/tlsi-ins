import { Gender } from "../../class/insi-person.class";
import BasicVirtualMode from "./BasicVirtualMode";
import { CRCodes, CRLabels, INSiMockedResponse, INSiServiceFetchInsRequest, INSiServiceRequestEnv, INSiServiceRequestStatus } from "../../models/insi-fetch-ins.models";

export class DeVinciRuthVirtualMode extends BasicVirtualMode {
    static getMockedResponse(requestId: string, { idam, version, name, requestDate, emitter }: INSiServiceRequestEnv): INSiServiceFetchInsRequest[] {
        const personDetails = {
            gender: Gender.Female,
            birthName: 'DE VINCI',
            firstName: 'RUTH',
            dateOfBirth: '1976-07-14',
            allFirstNames: 'RUTH',
        }
        const fetchRequestFlow: INSiMockedResponse[] = [{
            status: INSiServiceRequestStatus.FAIL,
            codeCR: CRCodes.NO_RESULT,
            LibelleCR: CRLabels.NO_RESULT,
            firstnameRequest: 'RUTH',
        }];
        const deVinciRuthVirtualMode = new DeVinciRuthVirtualMode(fetchRequestFlow, personDetails);
        return deVinciRuthVirtualMode.getBuiltResponse({ idam, version, name, requestId, requestDate, emitter });
    }
}
