"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssertionPsSecurity = void 0;
const uuid_1 = require("uuid");
const xml_crypto_1 = require("xml-crypto");
function generateCreated() {
    const date = new Date();
    return date.getUTCFullYear() + '-' + ('0' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
        ('0' + date.getUTCDate()).slice(-2) + 'T' + ('0' + date.getUTCHours()).slice(-2) + ':' +
        ('0' + date.getUTCMinutes()).slice(-2) + ':' + ('0' + date.getUTCSeconds()).slice(-2) + 'Z';
}
function insertStr(stringToInsert, destination, position) {
    return [destination.slice(0, position), stringToInsert, destination.slice(position)].join('');
}
class AssertionPsSecurity {
    constructor(privatePEM, publicP12PEM, password, assertionPsInfos) {
        this.assertionPsInfos = assertionPsInfos;
        this.publicP12PEM = publicP12PEM.toString()
            .replace('-----BEGIN CERTIFICATE-----', '')
            .replace('-----END CERTIFICATE-----', '')
            .replace(/(\r\n|\n|\r)/gm, '');
        this.signer = new xml_crypto_1.SignedXml();
        this.signer.signatureAlgorithm = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256';
        this.signer.signingKey = { key: privatePEM, passphrase: password };
        this.signer.keyInfoProvider = {};
        this.signer.keyInfoProvider.getKeyInfo = () => `<ds:X509Data><ds:X509Certificate>${this.publicP12PEM}</ds:X509Certificate></ds:X509Data>`;
    }
    postProcess(xml, envelopeKey = 'soap', options = {}) {
        const assertionID = options.id || `_${(0, uuid_1.v4)()}`;
        const assertionTimeStamp = options.dateTime || generateCreated();
        const secHeader = `<wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">` +
            `<saml:Assertion xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ID="${assertionID}" IssueInstant="${assertionTimeStamp}" Version="2.0" xsi:schemaLocation="urn:oasis:names:tc:SAML:2.0:assertion http://docs.oasis-open.org/security/saml/v2.0/saml-schema-assertion-2.0.xsd">` +
            `<saml:Issuer Format="urn:oasis:names:tc:SAML:1.1:nameid-format:X509SubjectName">${this.assertionPsInfos.issuer}</saml:Issuer>` +
            `<saml:Subject>` +
            `<saml:NameID NameQualifier="${this.assertionPsInfos.nameQualifier}">${this.assertionPsInfos.nameId}</saml:NameID>` +
            `</saml:Subject>` +
            `<saml:AttributeStatement>` +
            `<saml:Attribute Name="identifiantFacturation">` +
            `<saml:AttributeValue>${this.assertionPsInfos.identifiantFacturation}</saml:AttributeValue>` +
            `</saml:Attribute>` +
            `<saml:Attribute Name="codeSpecialiteAMO">` +
            `<saml:AttributeValue>${this.assertionPsInfos.codeSpecialiteAMO}</saml:AttributeValue>` +
            `</saml:Attribute>` +
            `<saml:Attribute Name="secteurActivite">` +
            `<saml:AttributeValue>${this.assertionPsInfos.secteurActivite}</saml:AttributeValue>` +
            `</saml:Attribute>` +
            `</saml:AttributeStatement>` +
            `</saml:Assertion>` +
            `</wsse:Security>`;
        const xmlWithSec = insertStr(secHeader, xml, xml.indexOf(`</${envelopeKey}:Header>`));
        this.signer.addReference(`//*[name(.)='saml:Assertion']`, ['http://www.w3.org/2000/09/xmldsig#enveloped-signature', 'http://www.w3.org/2001/10/xml-exc-c14n#'], ['http://www.w3.org/2001/04/xmlenc#sha256']);
        this.signer.computeSignature(secHeader, { existingPrefixes: { wsse: `http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd` } });
        return insertStr(this.signer.getSignatureXml(), xmlWithSec, xmlWithSec.indexOf('</saml:Assertion>'));
    }
}
exports.AssertionPsSecurity = AssertionPsSecurity;
//# sourceMappingURL=assertionPsSecurity.js.map