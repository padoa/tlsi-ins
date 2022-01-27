"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.INSiClient = void 0;
const path_1 = __importDefault(require("path"));
const soap_1 = require("soap");
const uuid_1 = require("uuid");
const certificates_1 = require("./utils/certificates");
const insi_soap_action_models_1 = require("./models/insi-soap-action.models");
const insi_error_1 = require("./utils/insi-error");
const insi_helper_1 = require("./utils/insi-helper");
class INSiClient {
    constructor({ lpsContext, bamContext }) {
        this._wsdlUrl = path_1.default.resolve(__dirname, '../wsdl/DESIR_ICIR_EXP_1.5.0.wsdl');
        this._lpsContext = lpsContext;
        this._bamContext = bamContext;
    }
    initClient(pfx, passphrase = '') {
        return __awaiter(this, void 0, void 0, function* () {
            this._soapClient = yield (0, soap_1.createClientAsync)(this._wsdlUrl, {
                forceSoap12Headers: true, // use soap v1.2
            });
            this._setClientSSLSecurityPFX(pfx, passphrase);
        });
    }
    fetchIns(person, { requestId = (0, uuid_1.v4)() } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._soapClient) {
                throw new Error('fetchIns ERROR: you must init client first');
            }
            const { header, method } = insi_soap_action_models_1.INSiSoapActions[insi_soap_action_models_1.INSiSoapActionsName.FETCH_FROM_IDENTITY_TRAITS];
            this._setDefaultHeaders();
            this._soapClient.addSoapHeader(header, 'Action', 'wsa', 'http://www.w3.org/2005/08/addressing');
            this._soapClient.addSoapHeader({ MessageID: requestId, }, 'MessageID', 'wsa', 'http://www.w3.org/2005/08/addressing');
            let rawSoapResponse;
            try {
                rawSoapResponse = yield this._soapClient[`${method}Async`](person.getSoapBodyAsJson());
            }
            catch (e) {
                // TODO: Better error management
                throw new insi_error_1.InsiError({ requestId: requestId, originalError: e });
            }
            finally {
                this._soapClient.clearSoapHeaders();
            }
            const [rawResponse, responseAsXMl, , requestAsXML] = rawSoapResponse;
            return {
                requestId,
                rawBody: rawResponse,
                body: insi_helper_1.InsiHelper.formatFetchINSRawResponse(rawResponse),
                bodyAsXMl: responseAsXMl,
                requestBodyAsXML: requestAsXML,
            };
        });
    }
    _setClientSSLSecurityPFX(pfx, passphrase) {
        this._soapClient.setSecurity(new soap_1.ClientSSLSecurityPFX(pfx, {
            passphrase,
            ca: (0, certificates_1.combineCACertAsPem)([
                path_1.default.resolve(__dirname, '../certificates/ca/ACR-EL.cer'),
                path_1.default.resolve(__dirname, '../certificates/ca/ACI-EL-ORG.cer'),
            ]),
        }));
    }
    _setDefaultHeaders() {
        const { soapHeader: bamSoapHeader, name: bamName, namespace: bamNamespace } = this._bamContext.getSoapHeaderAsJson();
        this._soapClient.addSoapHeader(bamSoapHeader, bamName, bamNamespace);
        const { soapHeader: lpsSoapHeader, name: lpsName, namespace: lpsNamespace } = this._lpsContext.getSoapHeaderAsJson();
        this._soapClient.addSoapHeader(lpsSoapHeader, lpsName, lpsNamespace);
    }
}
exports.INSiClient = INSiClient;
//# sourceMappingURL=insi-client.service.js.map