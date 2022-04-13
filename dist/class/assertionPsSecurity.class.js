"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssertionPsSecurityClass = void 0;
const https_1 = __importDefault(require("https"));
const lodash_1 = __importDefault(require("lodash"));
// Insert à string at a given position (return a new string)
function insertStr(stringToInsert, destination, position) {
    return [destination.slice(0, position), stringToInsert, destination.slice(position)].join('');
}
const WSS_WSSECURITY_SECEXT = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd';
class AssertionPsSecurityClass {
    constructor(assertionPs, defaultOptions) {
        this.assertionPs = assertionPs;
        this.defaultOptions = {};
        lodash_1.default.merge(this.defaultOptions, defaultOptions);
    }
    postProcess(xml, envelopeKey = 'soap') {
        const secHeader = `<wsse:Security xmlns:wsse="${WSS_WSSECURITY_SECEXT}">${this.assertionPs}</wsse:Security>`;
        return insertStr(secHeader, xml, xml.indexOf(`</${envelopeKey}:Header>`));
    }
    addOptions(options) {
        lodash_1.default.merge(options, this.defaultOptions);
        options.httpsAgent = new https_1.default.Agent(options);
    }
}
exports.AssertionPsSecurityClass = AssertionPsSecurityClass;
//# sourceMappingURL=assertionPsSecurity.class.js.map