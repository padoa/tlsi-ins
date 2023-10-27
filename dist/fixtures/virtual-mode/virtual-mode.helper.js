"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPersonMockedRequest = void 0;
const AdrunZoeVirtualMode_1 = require("./AdrunZoeVirtualMode");
const TchitchiOlaVirtualMode_1 = require("./TchitchiOlaVirtualMode");
const insi_fetch_ins_models_1 = require("../../models/insi-fetch-ins.models");
const HouillesPierreVirtualMode_1 = require("./HouillesPierreVirtualMode");
const CorseAnthonyVirtualMode_1 = require("./CorseAnthonyVirtualMode");
const EcetinsiPierreAlainVirtualMode_1 = require("./EcetinsiPierreAlainVirtualMode");
const HermanGatienVirtualMode_1 = require("./HermanGatienVirtualMode");
const NessiMichelangeloVirtualMode_1 = require("./NessiMichelangeloVirtualMode");
const BasicVirtualMode_1 = __importDefault(require("./BasicVirtualMode"));
const getPersonMockedRequest = (person, clientConfig) => {
    const formattedName = `${person.birthName} ${person.firstName}`.toLowerCase();
    let fetchRequests = [];
    switch (formattedName) {
        case insi_fetch_ins_models_1.INSITestingUser.TCHITCHI:
            fetchRequests = TchitchiOlaVirtualMode_1.TchitchiOlaVirtualMode.getBuiltResponse(clientConfig);
            break;
        case insi_fetch_ins_models_1.INSITestingUser.ADRUN:
            fetchRequests = AdrunZoeVirtualMode_1.AdrunZoeVirtualMode.getBuiltResponse(clientConfig);
            break;
        case insi_fetch_ins_models_1.INSITestingUser.CORSE:
            fetchRequests = CorseAnthonyVirtualMode_1.CorseAnthonyVirtualMode.getBuiltResponse(clientConfig);
            break;
        case insi_fetch_ins_models_1.INSITestingUser.HOUILLES:
            fetchRequests = HouillesPierreVirtualMode_1.HouillesPierreVirtualMode.getBuiltResponse(clientConfig);
            break;
        case insi_fetch_ins_models_1.INSITestingUser.ECETINSI:
            fetchRequests = EcetinsiPierreAlainVirtualMode_1.EcetinsiPierreAlainVirtualMode.getBuiltResponse(clientConfig);
            break;
        case insi_fetch_ins_models_1.INSITestingUser.HERMAN:
            fetchRequests = HermanGatienVirtualMode_1.HermanGatienVirtualMode.getBuiltResponse(clientConfig);
            break;
        case insi_fetch_ins_models_1.INSITestingUser.NESSIMICHELANGELO:
            fetchRequests = NessiMichelangeloVirtualMode_1.NessiMichelangeloVirtualMode.getBuiltResponse(clientConfig);
            break;
        default:
            fetchRequests = BasicVirtualMode_1.default.getBuiltNotImplementedResponse(clientConfig, person);
            break;
    }
    return fetchRequests;
};
exports.getPersonMockedRequest = getPersonMockedRequest;
//# sourceMappingURL=virtual-mode.helper.js.map