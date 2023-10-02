import { Gender } from "../../class/insi-person.class";
import BasicVirtualMode from "./BasicVirtualMode";
import { CRCodes, CRLabels, INSiMockedResponse, INSiServiceFetchInsRequest, INSiServiceRequestEnv, INSiServiceRequestStatus } from '../../models/insi-fetch-ins.models';

export class HouillesPierreVirtualMode extends BasicVirtualMode {
    static getMockedResponse(requestId: string, { idam, version, name, requestDate }: INSiServiceRequestEnv): INSiServiceFetchInsRequest[] {
        const personDetails = {
            birthName: 'HOUILLES',
            gender: Gender.Male,
            dateOfBirth: '1993-01-27',
        }
        const fetchRequestFlow: INSiMockedResponse[] = [{
            status: INSiServiceRequestStatus.SUCCESS,
            firstnameRequest: 'PIERRE',
            codeCR: CRCodes.NO_RESULT,
            LibelleCR: CRLabels.NO_RESULT,
        }, {
            status: INSiServiceRequestStatus.SUCCESS,
            codeCR: CRCodes.NO_RESULT,
            LibelleCR: CRLabels.NO_RESULT,
            firstnameRequest: 'PAUL',
        }, {
            status: INSiServiceRequestStatus.SUCCESS,
            codeCR: CRCodes.NO_RESULT,
            LibelleCR: CRLabels.NO_RESULT,
            firstnameRequest: 'JACQUES',
        }, {
            status: INSiServiceRequestStatus.SUCCESS,
            codeCR: CRCodes.NO_RESULT,
            LibelleCR: CRLabels.NO_RESULT,
            firstnameRequest: 'PIERRE PAUL JACQUES',
        },
    ]
    const houillesPierreVirtualMode = new HouillesPierreVirtualMode(fetchRequestFlow, personDetails);
    return houillesPierreVirtualMode.getBuiltResponse({ idam, version, name, requestId, requestDate });
}
}
