"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readCertAsPem = exports.combineCertAsPem = void 0;
const node_forge_1 = __importDefault(require("node-forge"));
const fs_1 = __importDefault(require("fs"));
const combineCertAsPem = (caCertPaths) => {
    return caCertPaths.map(exports.readCertAsPem).join('');
};
exports.combineCertAsPem = combineCertAsPem;
const readCertAsPem = (path) => {
    const certFile = fs_1.default.readFileSync(path, 'binary');
    const asn1Cert = node_forge_1.default.asn1.fromDer(certFile);
    const certificate = node_forge_1.default.pki.certificateFromAsn1(asn1Cert);
    const pem = node_forge_1.default.pki.certificateToPem(certificate);
    return pem;
};
exports.readCertAsPem = readCertAsPem;
//# sourceMappingURL=certificates.js.map