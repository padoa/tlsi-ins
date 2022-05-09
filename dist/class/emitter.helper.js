"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmitterHelper = void 0;
const forge = __importStar(require("node-forge"));
class EmitterHelper {
    static getEmitterFromPfx(pfx, passphrase) {
        let organizationalUnit;
        try {
            const p12Der = forge.util.decode64(pfx.toString('base64'));
            const p12Asn1 = forge.asn1.fromDer(p12Der);
            const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, passphrase);
            const bags = p12.getBags({ bagType: forge.pki.oids.certBag });
            const certBag = bags[forge.pki.oids.certBag];
            if (!certBag) {
                throw 'Unable to find certBag';
            }
            const { cert } = certBag[0];
            if (!cert) {
                throw 'Unable to find a cert in the certBag';
            }
            organizationalUnit = cert.issuer.getField('OU').value;
        }
        catch (error) {
            throw new Error(`Failed to get Emitter from pfx: ${JSON.stringify(error)}`);
        }
        return organizationalUnit;
    }
    static getEmitterFromAssertionPs(assertionPs) {
        var _a;
        const emitter = (_a = /(?<=">)([^<>]*?)(?=<\/NameID>)/.exec(assertionPs)) === null || _a === void 0 ? void 0 : _a[0];
        if (!emitter) {
            throw new Error(`Failed to get Emitter from assertion`);
        }
        return emitter;
    }
}
exports.EmitterHelper = EmitterHelper;
//# sourceMappingURL=emitter.helper.js.map