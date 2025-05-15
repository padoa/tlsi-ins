"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedimailClient = void 0;
const path = __importStar(require("path"));
const soap_1 = require("soap");
const soap_2 = require("soap");
const medimail_types_1 = require("./models/medimail.types");
const formatDateToDatetime = (date) => date.toISOString().slice(0, 19);
class MedimailClient {
    constructor() {
        this.wsdlUrl = path.resolve(__dirname, '../wsdl/medimail.wsdl');
    }
    init(pfx, passphrase = '', acount = '') {
        return __awaiter(this, void 0, void 0, function* () {
            this.httpClient = new soap_1.HttpClient();
            this.acount = acount;
            this.wsdl = new soap_2.WSDL(this.wsdlUrl, this.wsdlUrl, {});
            this.soapClient = yield (0, soap_1.createClientAsync)(this.wsdlUrl, {
                forceSoap12Headers: true,
                httpClient: this.httpClient,
            });
            this.soapClient.setSecurity(new soap_1.ClientSSLSecurityPFX(pfx, {
                passphrase,
            }));
        });
    }
    /**
     * Test the api with a simple hello, the specified name should be the email of the connected user
     *
     * @param name Name of the user to greet
     * @returns Promise<HelloResult>
     */
    hello(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = { name };
            const reply = yield this.call(medimail_types_1.MedimailActions.HELLO, payload);
            return this.wsdl.xmlToObject(reply.formatted.return.$value);
        });
    }
    /**
     * Send a message through the Medimail API.
     *
     * @param options options of the message to send
     * @param options.title title of the message to send
     * @param options.message text body of the message to send
     * @param options.signatories main recipients of the message to send (what we would usually call 'recipient')
     * @param options.recipients recipients for information of the message to send
     * @param options.attachments files to attach to the message to send, max size 5
     * @returns Promise<SendResult>
     */
    send(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, message, signatories, recipients, attachments } = options;
            const joinedSignatories = signatories.join(';');
            const joinedRecipients = recipients === null || recipients === void 0 ? void 0 : recipients.join(';');
            const payload = {
                message,
                title,
                acount: this.acount,
                signatories: joinedSignatories,
                recipients: joinedRecipients,
                attachments,
            };
            const reply = yield this.call(medimail_types_1.MedimailActions.SEND, payload);
            return this.wsdl.xmlToObject(reply.formatted.sendResult.$value);
        });
    }
    /**
     * Opens the Medimail mailbox of the user, and returns the list of messages sent, received or both.
     *
     * @param type The type of data to get (1 = all, 2 = only received, 3 = only sent)
     * @param begindate The date to start the search
     * @param enddate The date to end the search
     * @returns Promise<CheckboxReturn>
     */
    checkbox(type, begindate, enddate = new Date()) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = Object.assign({ acount: this.acount, type, begindate: formatDateToDatetime(begindate) }, (enddate ? { enddate: formatDateToDatetime(enddate) } : {}));
            const reply = yield this.call(medimail_types_1.MedimailActions.CHECKBOX, payload);
            return this.wsdl.xmlToObject(reply.formatted.checkboxReturn.$value);
        });
    }
    /**
     * Open a message to the Medimail API.
     *
     * @param ref The reference (id) of the message to open
     * @returns Promise<OpenResult>
     */
    open(ref) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                ref,
                acount: this.acount,
            };
            const reply = yield this.call(medimail_types_1.MedimailActions.OPEN, payload);
            return this.wsdl.xmlToObject(reply.formatted.openReturn.$value);
        });
    }
    call(action, soapBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.soapClient[action](soapBody, (err, result, rawResponse) => {
                    if (err) {
                        reject(err);
                    }
                    const errorString = this.extractErrorIfPresent(result);
                    if (errorString) {
                        reject(new Error(errorString));
                    }
                    const formattedResponse = {
                        formatted: result,
                        xml: rawResponse,
                        error: null,
                    };
                    resolve(formattedResponse);
                });
            });
        });
    }
    extractErrorIfPresent(result) {
        if (result && result.return && result.return.$value) {
            const errorXml = result.return.$value;
            const errorMatch = errorXml.match(/<error id="\d+">(.+)<\/error>/);
            if (errorMatch) {
                return errorMatch[1];
            }
        }
        return null;
    }
}
exports.MedimailClient = MedimailClient;
//# sourceMappingURL=medimail-client.service.js.map