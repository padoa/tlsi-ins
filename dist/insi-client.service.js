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
exports.INSiClient = exports.INSi_mTLS_TEST_URL = exports.INSi_CPX_TEST_URL = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const soap_1 = require("soap");
const uuid_1 = require("uuid");
const lps_context_class_1 = require("./class/lps-context.class");
const bam_context_class_1 = require("./class/bam-context.class");
const certificates_1 = require("./utils/certificates");
const insi_soap_action_models_1 = require("./models/insi-soap-action.models");
const insi_fetch_ins_models_1 = require("./models/insi-fetch-ins.models");
const insi_error_1 = require("./utils/insi-error");
const insi_helper_1 = require("./utils/insi-helper");
const assertionPsSecurity_class_1 = require("./class/assertionPsSecurity.class");
const insi_fetch_ins_special_cases_models_1 = require("./models/insi-fetch-ins-special-cases.models");
const virtual_mode_helper_1 = require("./fixtures/virtual-mode/virtual-mode.helper");
const lodash_1 = __importDefault(require("lodash"));
const env_1 = require("./models/env");
const lps_class_1 = require("./class/lps.class");
exports.INSi_CPX_TEST_URL = 'https://qualiflps.services-ps.ameli.fr:443/lps';
exports.INSi_mTLS_TEST_URL = 'https://qualiflps-services-ps-tlsm.ameli.fr:443/lps';
/**
 * @constructor
 * @param  {INSiClientArgs} InsClientArguments contains the lpsContext and the bamContext
 */
class INSiClient {
    constructor({ lpsContext, bamContext, overrideSpecialCases }) {
        this._wsdlUrl = path_1.default.resolve(__dirname, '../wsdl/DESIR_ICIR_EXP_1.5.0.wsdl');
        this._lpsContext = lpsContext;
        this._bamContext = bamContext;
        this._overrideSpecialCases = !!overrideSpecialCases;
    }
    /**
     * Initializes a soap client and sets it's SSLSecurityPFX TLS authentication
     * @param  {Buffer} pfx contains the SSL certificate (public keys) and the corresponding private keys
     * @param  {string=''} passphrase needed for the pfx
     * @param  {string} endpoint service url, test by default
     * @returns Promise
     */
    initClientPfx(pfx, passphrase = '', endpoint = exports.INSi_mTLS_TEST_URL) {
        return __awaiter(this, void 0, void 0, function* () {
            this._httpClient = new soap_1.HttpClient();
            this._soapClient = yield (0, soap_1.createClientAsync)(this._wsdlUrl, {
                forceSoap12Headers: true, // use soap v1.2
                httpClient: this._httpClient,
            });
            this._soapClient.setEndpoint(endpoint);
            this._setClientSSLSecurityPFX(pfx, passphrase);
        });
    }
    /**
     * Initializes a soap client and sets it's AssertionPsSecurity
     * @param  {string} assertionPs the assertion Ps to use for the call
     * @param  {string} endpoint service url, test by default
     * @returns Promise
     */
    initClientCpx(assertionPs, endpoint = exports.INSi_CPX_TEST_URL) {
        return __awaiter(this, void 0, void 0, function* () {
            this._httpClient = new soap_1.HttpClient();
            this._soapClient = yield (0, soap_1.createClientAsync)(this._wsdlUrl, {
                forceSoap12Headers: true, // use soap v1.2
                httpClient: this._httpClient,
            });
            this._soapClient.setEndpoint(endpoint);
            this._setAssertionPsSecurity(assertionPs);
        });
    }
    /**
     * Fetches INS information of a person
     * @param  {INSiPerson} person the person who's information are about to be fetched
     * @param  {string} requestId of the current request to Ins
     * @param  {boolean} virtualModeEnabled a boolean that enabled or not the virtual mode
     * @returns Promise<INSiServiceFetchInsResult>
     */
    fetchIns(person, { requestId = (0, uuid_1.v4)(), virtualModeEnabled = false } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._soapClient && !virtualModeEnabled) {
                throw new Error('fetchIns ERROR: you must init client security first');
            }
            const fetchInsRequests = yield this._launchSoapRequestForPerson(person, requestId, virtualModeEnabled);
            const [[successFetchRequest], failedFetchRequests] = lodash_1.default.partition(fetchInsRequests, (req) => insi_helper_1.InsiHelper.checkIfRequestIsValid(req));
            return {
                successRequest: successFetchRequest || null,
                failedRequests: failedFetchRequests,
            };
        });
    }
    _launchSoapRequestForPerson(person, requestId, virtualModeEnabled) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (virtualModeEnabled) {
                return this._getMockedPersonRequest(person, requestId);
            }
            const fetchRequests = [];
            const namesToSendRequestFor = person.getSoapBodyAsJson();
            const savedOverriddenHttpClientResponseHandler = this._httpClient.handleResponse;
            // Try for each person name, stop if technical error or perfect match
            for (let i = 0; i < namesToSendRequestFor.length; i++) {
                this._soapClient.clearSoapHeaders();
                this._setSoapHeaders(requestId);
                try {
                    this._manageCndaValidationSpecialCases(namesToSendRequestFor[i].Prenom);
                    const fetchRequest = yield this._callFetchFromIdentityTraits(requestId, namesToSendRequestFor[i]);
                    fetchRequests.push(fetchRequest);
                    // reset the httpClient to the original one
                    this._httpClient.handleResponse = savedOverriddenHttpClientResponseHandler;
                    // If we find a result we stop the loop
                    if (((_c = (_b = (_a = fetchRequest.response) === null || _a === void 0 ? void 0 : _a.json) === null || _b === void 0 ? void 0 : _b.CR) === null || _c === void 0 ? void 0 : _c.CodeCR) === insi_fetch_ins_models_1.CRCodes.OK || fetchRequest.response.error) {
                        break;
                    }
                }
                catch (fetchError) {
                    // reset the httpClient to the original one
                    this._httpClient.handleResponse = savedOverriddenHttpClientResponseHandler;
                    const originalError = this._specificErrorManagement(fetchError) || fetchError;
                    throw new insi_error_1.InsiError({ requestId: requestId, originalError });
                }
            }
            return fetchRequests;
        });
    }
    /**
     * This method is public as it needs to be mocked
     * @returns The emitter of the request
     */
    getINSiServiceRequestEnvConfig() {
        return {
            emitter: this._lpsContext.emitter,
            idam: this._lpsContext.lps.idam,
            version: this._lpsContext.lps.softwareVersion,
            softwareName: this._lpsContext.lps.softwareName,
        };
    }
    /**
     * Fetches INS information of a person
     * @param  {INSiPerson} person the person who's information are about to be fetched
     * @param  {string} requestId of the current request to Ins
     * @returns Promise<INSiServiceFetchInsResult>
     */
    _getMockedPersonRequest(person, requestId) {
        const requestDate = new Date().toISOString();
        const clientConfig = Object.assign(Object.assign({}, this.getINSiServiceRequestEnvConfig()), { requestId, requestDate });
        const fetchRequests = (0, virtual_mode_helper_1.getPersonMockedRequest)(person.getPerson(), clientConfig);
        return Promise.resolve(fetchRequests);
    }
    _callFetchFromIdentityTraits(requestId, soapBody) {
        const { method } = insi_soap_action_models_1.INSiSoapActions[insi_soap_action_models_1.INSiSoapActionsName.FETCH_FROM_IDENTITY_TRAITS];
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            this._soapClient[`${method}`](soapBody, (err, result, rawResponse, soapHeader, rawRequest) => {
                var _a;
                if (((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.status) === 500 && err.body) {
                    resolve({
                        status: insi_fetch_ins_models_1.INSiServiceRequestStatus.FAIL,
                        request: {
                            id: requestId,
                            xml: rawRequest,
                        },
                        response: {
                            formatted: null,
                            json: null,
                            xml: rawResponse,
                            error: insi_helper_1.InsiHelper.getServiceErrorFromXML(rawResponse),
                        },
                    });
                }
                else if (err) {
                    reject(err);
                }
                else {
                    resolve({
                        status: insi_fetch_ins_models_1.INSiServiceRequestStatus.SUCCESS,
                        request: {
                            id: requestId,
                            xml: rawRequest,
                        },
                        response: {
                            formatted: insi_helper_1.InsiHelper.formatFetchINSResult(result),
                            json: insi_helper_1.InsiHelper.changeInsHistoToArray(result),
                            xml: rawResponse,
                            error: null,
                        },
                    });
                }
            });
        }));
    }
    _setSoapHeaders(requestId) {
        const { header } = insi_soap_action_models_1.INSiSoapActions[insi_soap_action_models_1.INSiSoapActionsName.FETCH_FROM_IDENTITY_TRAITS];
        this._setDefaultHeaders();
        this._soapClient.addSoapHeader(header, 'Action', 'wsa', 'http://www.w3.org/2005/08/addressing');
        this._soapClient.addSoapHeader({ MessageID: `uuid:${requestId}` }, 'MessageID', 'wsa', 'http://www.w3.org/2005/08/addressing');
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
    _setAssertionPsSecurity(assertionPs) {
        this._soapClient.setSecurity(new assertionPsSecurity_class_1.AssertionPsSecurityClass(assertionPs, {
            ca: (0, certificates_1.combineCertAsPem)([
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
    _overrideHttpClientResponse(fileName) {
        const copyOfHttpClient = Object.assign({}, this._httpClient);
        copyOfHttpClient.handleResponse = this._httpClient.handleResponse;
        this._httpClient.handleResponse = function (req, res, _body) {
            const overriddenBody = fs_1.default.readFileSync(path_1.default.resolve(__dirname, fileName), 'utf-8');
            return copyOfHttpClient.handleResponse(req, res, overriddenBody);
        };
    }
    _manageCndaValidationSpecialCases(firstName) {
        if (!this._overrideSpecialCases) {
            return;
        }
        if (insi_fetch_ins_special_cases_models_1.CR01_STAGING_ENV_CASES.includes(firstName)) {
            this._overrideHttpClientResponse('./fixtures/REP_CR01.xml');
        }
        if (insi_fetch_ins_special_cases_models_1.TEST_2_04_STAGING_ENV_CASES.includes(firstName)) {
            this._overrideHttpClientResponse('./fixtures/TEST_2.04_cas2.xml');
        }
        if (insi_fetch_ins_special_cases_models_1.TEST_2_05_STAGING_ENV_CASES.includes(firstName)) {
            this._overrideHttpClientResponse('./fixtures/TEST_2.05.xml');
        }
        if (insi_fetch_ins_special_cases_models_1.TEST_2_08_01_STAGING_ENV_CASES.includes(firstName)) {
            this._overrideHttpClientResponse('./fixtures/TEST_2.08_cas1.xml');
        }
        if (insi_fetch_ins_special_cases_models_1.TEST_2_08_02_STAGING_ENV_CASES.includes(firstName)) {
            this._overrideHttpClientResponse('./fixtures/TEST_2.08_cas2.xml');
        }
    }
}
exports.INSiClient = INSiClient;
INSiClient.getClientWithDefinedId = (idam, overrideSpecialCases = true, softwareVersion, softwareName, emitter) => {
    const lps = new lps_class_1.LPS({
        idam,
        version: softwareVersion ? softwareVersion : env_1.SOFTWARE_VERSION,
        name: softwareName ? softwareName : env_1.SOFTWARE_NAME,
        id: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
    });
    const lpsContext = new lps_context_class_1.LpsContext({
        emitter: emitter ? emitter : 'medecin@yopmail.com',
        lps,
    });
    const bamContext = new bam_context_class_1.BamContext({
        emitter: emitter ? emitter : 'medecin@yopmail.com',
    });
    return new INSiClient({
        lpsContext,
        bamContext,
        overrideSpecialCases,
    });
};
//# sourceMappingURL=insi-client.service.js.map