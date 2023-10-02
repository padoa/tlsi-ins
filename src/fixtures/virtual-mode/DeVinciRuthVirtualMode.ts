import { Gender, INSiPersonArgs } from "../../class/insi-person.class";
import { getCNDAValidationXmlRequest } from "../insi-client.fixture";
import BasicVirtualMode from "./BasicVirtualMode";
import { CRCodes, CRLabels, INSiMockedResponse, INSiServiceFetchInsRequest, INSiServiceFormattedResponse, INSiServiceJsonResponse, INSiServiceRequestEnv, INSiServiceRequestStatus } from "../../models/insi-fetch-ins.models";
import { v4 as uuidv4 } from 'uuid';

export class DeVinciRuthVirtualMode extends BasicVirtualMode {
    static getMockedResponse(requestId: string, { idam, version, name, requestDate }: INSiServiceRequestEnv): INSiServiceFetchInsRequest[] {
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
        return deVinciRuthVirtualMode.getBuiltResponse({ idam, version, name, requestId, requestDate });
    }
}
