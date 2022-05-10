"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmitterHelper = void 0;
const node_forge_1 = require("node-forge");
class EmitterHelper {
    static getEmitterFromPfx(pfx, passphrase) {
        let organizationalUnit;
        const p12Der = node_forge_1.util.decode64(pfx.toString('base64'));
        const p12Asn1 = node_forge_1.asn1.fromDer(p12Der);
        const p12 = node_forge_1.pkcs12.pkcs12FromAsn1(p12Asn1, false, passphrase);
        const bags = p12.getBags({ bagType: node_forge_1.pki.oids.certBag });
        const certBag = bags[node_forge_1.pki.oids.certBag];
        if (!certBag) {
            throw new Error('Unable to find certBag');
        }
        const { cert } = certBag[0];
        if (!cert) {
            throw new Error('Unable to find a cert in the certBag');
        }
        organizationalUnit = cert.subject.getField('OU').value;
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