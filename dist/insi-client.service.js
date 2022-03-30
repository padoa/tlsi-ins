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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const soap_1 = require("soap");
const uuid_1 = require("uuid");
const certificates_1 = require("./utils/certificates");
const insi_soap_action_models_1 = require("./models/insi-soap-action.models");
const insi_fetch_ins_models_1 = require("./models/insi-fetch-ins.models");
const insi_error_1 = require("./utils/insi-error");
const insi_helper_1 = require("./utils/insi-helper");
const assertionPsSecurity_class_1 = require("./class/assertionPsSecurity.class");
/**
 * @constructor
 * @param  {INSiClientArgs} InsClientArguments contains the lpsContext and the bamContext
 */
class INSiClient {
    constructor({ lpsContext, bamContext }) {
        this._wsdlUrl = path_1.default.resolve(__dirname, '../wsdl/DESIR_ICIR_EXP_1.5.0.wsdl');
        this._lpsContext = lpsContext;
        this._bamContext = bamContext;
    }
    /**
     * Initializes a soap client and sets it's SSLSecurityPFX TLS authentication
     * @param  {Buffer} pfx contains the SSL certificate (public keys) and the corresponding private keys
     * @param  {string=''} passphrase needed for the pfx
     * @returns Promise
     */
    initClientPfx(pfx, passphrase = '') {
        return __awaiter(this, void 0, void 0, function* () {
            this._soapClient = yield (0, soap_1.createClientAsync)(this._wsdlUrl, {
                forceSoap12Headers: true, // use soap v1.2
            });
            this._setClientSSLSecurityPFX(pfx, passphrase);
        });
    }
    /**
     * Initializes a soap client and sets it's AssertionPsSecurity
     * @param  {string} privateKey the private key for certificate sign
     * @param  {string} publicKey the associated public key
     * @param  {string=''} password of the privateKey if needed
     * @param  {AssertionPsInfos} assertionPsInfos infos of the PS (Personel de Santé) that needed to build the assertion
     * @returns Promise
     */
    initClientCpx(privateKey, publicKey, password = '', assertionPsInfos) {
        return __awaiter(this, void 0, void 0, function* () {
            this._soapClient = yield (0, soap_1.createClientAsync)(this._wsdlUrl, {
                forceSoap12Headers: true, // use soap v1.2
            });
            this._setAssertionPsSecurity(privateKey, publicKey, password, assertionPsInfos);
        });
    }
    /**
     * Fetches INS information of a person
     * @param  {INSiPerson} person the person who's information are about to be fetched
     * @param  {string} requestId of the current request to Ins
     * @returns Promise<INSiFetchInsResponse>
     */
    fetchIns(person, { requestId = (0, uuid_1.v4)() } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._soapClient) {
                throw new Error('fetchIns ERROR: you must init client first');
            }
            const { header } = insi_soap_action_models_1.INSiSoapActions[insi_soap_action_models_1.INSiSoapActionsName.FETCH_FROM_IDENTITY_TRAITS];
            this._setDefaultHeaders();
            this._soapClient.addSoapHeader(header, 'Action', 'wsa', 'http://www.w3.org/2005/08/addressing');
            this._soapClient.addSoapHeader({ MessageID: requestId, }, 'MessageID', 'wsa', 'http://www.w3.org/2005/08/addressing');
            return this._launchSoapRequestForPerson(person, requestId);
        });
    }
    _launchSoapRequestForPerson(person, requestId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let rawSoapResponse;
            const failedRequests = [];
            const namesToSendRequestFor = person.getSoapBodyAsJson();
            const { method } = insi_soap_action_models_1.INSiSoapActions[insi_soap_action_models_1.INSiSoapActionsName.FETCH_FROM_IDENTITY_TRAITS];
            for (let i = 0; i < namesToSendRequestFor.length; i++) {
                try {
                    rawSoapResponse = yield this._soapClient[`${method}Async`](namesToSendRequestFor[i]);
                    // in production environnement this error will not be thrown, but it will be a normal response, so we add it to the failed requests
                    if (((_b = (_a = rawSoapResponse[0]) === null || _a === void 0 ? void 0 : _a.CR) === null || _b === void 0 ? void 0 : _b.CodeCR) !== insi_fetch_ins_models_1.CRCodes.NO_RESULT) {
                        break;
                    }
                    failedRequests.push(this._getFetchResponseFromRawSoapResponse(rawSoapResponse, requestId));
                }
                catch (fetchError) {
                    // This is a special case, in the test environnement when the request is not found, the soap client will throw an error
                    if (person.isCR01SpecialCase()) {
                        const failedResponse = this._getCR01Response(person, namesToSendRequestFor[i].Prenom);
                        failedRequests.push(this._getFetchResponseFromRawSoapResponse(failedResponse, requestId));
                        rawSoapResponse = failedResponse;
                    }
                    else {
                        // this is the default error management
                        const originalError = this._specificErrorManagement(fetchError) || fetchError;
                        throw new insi_error_1.InsiError({ requestId: requestId, originalError });
                    }
                }
            }
            this._soapClient.clearSoapHeaders();
            return Object.assign(Object.assign({}, this._getFetchResponseFromRawSoapResponse(rawSoapResponse, requestId)), { failedRequests: failedRequests });
        });
    }
    _getFetchResponseFromRawSoapResponse(rawSoapResponse, requestId) {
        const [rawResponse, responseAsXMl, , requestAsXML] = rawSoapResponse;
        return {
            requestId,
            rawBody: rawResponse,
            body: insi_helper_1.InsiHelper.formatFetchINSRawResponse(rawResponse),
            bodyAsXMl: responseAsXMl,
            requestBodyAsXML: requestAsXML,
        };
    }
    _setClientSSLSecurityPFX(pfx, passphrase) {
        this._soapClient.setSecurity(new soap_1.ClientSSLSecurityPFX(pfx, {
            passphrase,
            ca: (0, certificates_1.combineCertAsPem)([
                path_1.default.resolve(__dirname, '../certificates/ca/ACR-EL.cer'),
                path_1.default.resolve(__dirname, '../certificates/ca/ACI-EL-ORG.cer'),
            ]),
        }));
    }
    _setAssertionPsSecurity(privateKey, publicKey, password, assertionPsInfos) {
        const assertionPs = new assertionPsSecurity_class_1.AssertionPsSecurityClass(privateKey, publicKey, password, assertionPsInfos);
        this._soapClient.setSecurity(assertionPs);
    }
    _setDefaultHeaders() {
        const { soapHeader: bamSoapHeader, name: bamName, namespace: bamNamespace } = this._bamContext.getSoapHeaderAsJson();
        this._soapClient.addSoapHeader(bamSoapHeader, bamName, bamNamespace);
        const { soapHeader: lpsSoapHeader, name: lpsName, namespace: lpsNamespace } = this._lpsContext.getSoapHeaderAsJson();
        this._soapClient.addSoapHeader(lpsSoapHeader, lpsName, lpsNamespace);
    }
    _specificErrorManagement(error) {
        if (error.toString().includes('not enough data')) {
            return { body: 'Le fichier pfx fourni n\'est pas un fichier pfx valid' };
        }
        if (error.toString().includes('mac verify failure')) {
            return { body: 'La passe phrase n\'est pas correct' };
        }
        if (error.body) {
            /**
             * The INSi service returns an xml response with a tag <siram:Erreur> which contains the error
             * we catch this error and send it
            */
            return { body: error.body.match(/(<siram:Erreur(.*)>)(.*)(<\/siram:Erreur>)/)[3] };
        }
        return error.toString().length > 0 ? { body: error.toString() } : undefined;
    }
    _getCR01Response(person, CustomFirstName) {
        const { birthName, firstName, gender, dateOfBirth } = person.getPerson();
        const lpsContext = this._lpsContext.getSoapHeaderAsJson();
        const requestAsXML = (0, insi_fetch_ins_models_1.getCR01XmlRequest)({
            idam: lpsContext.soapHeader.ContexteLPS.LPS.IDAM.$value,
            version: lpsContext.soapHeader.ContexteLPS.LPS.Version,
            name: lpsContext.soapHeader.ContexteLPS.LPS.Nom,
            birthName,
            firstName: CustomFirstName || firstName,
            sexe: gender,
            dateOfBirth,
        });
        const rawResponse = {
            CR: { CodeCR: insi_fetch_ins_models_1.CRCodes.NO_RESULT, LibelleCR: insi_fetch_ins_models_1.CRLabels.NO_RESULT },
        };
        const responseAsXML = fs_1.default.readFileSync('src/fixtures/REP_CR01.xml', 'utf-8');
        return [rawResponse, responseAsXML, undefined, requestAsXML];
    }
}
exports.INSiClient = INSiClient;
//# sourceMappingURL=insi-client.service.js.map