import { v4 as uuidv4 } from 'uuid';
import { SignedXml } from 'xml-crypto';
import { ISecurity } from 'soap';

// Generate a date to the correct format
function generateDate(): string {
  const date = new Date();
  return date.getUTCFullYear() + '-' + ('0' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
    ('0' + date.getUTCDate()).slice(-2) + 'T' + ('0' + date.getUTCHours()).slice(-2) + ':' +
    ('0' + date.getUTCMinutes()).slice(-2) + ':' + ('0' + date.getUTCSeconds()).slice(-2) + 'Z';
}

// Insert à string at a given position (return a new string)
function insertStr(stringToInsert: string, destination: string, position: number): string {
  return [destination.slice(0, position), stringToInsert, destination.slice(position)].join('');
}

export interface AssertionPsInfos {
  issuer: string;
  nameQualifier: string;
  nameId: string;
  identifiantFacturation: string;
  codeSpecialiteAMO: string;
  secteurActivite: string;
}

export interface AssertionPsOptions {
  id?: string; // UUID
  dateTime?: string; // YYYY-MM-DDTHH:mm:ss.sssZ
}

const WSS_WSSECURITY_SECEXT = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd';
const XML_SCHEMA_INSTANCE = 'http://www.w3.org/2001/XMLSchema-instance';
const SAML_SCHEMA_ASSERTION_2_0 = 'http://docs.oasis-open.org/security/saml/v2.0/saml-schema-assertion-2.0.xsd';
const RSA_SHA256 = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256';
const SHA256 = 'http://www.w3.org/2001/04/xmlenc#sha256';
const XML_EXC_C14 = 'http://www.w3.org/2001/10/xml-exc-c14n#';
const XMLDSIG_ENVELOPED_SIGNATURE = 'http://www.w3.org/2000/09/xmldsig#enveloped-signature';

export class AssertionPsSecurityClass implements ISecurity {
  private _assertionPsInfos: AssertionPsInfos;
  private _publicP12PEM: string;
  private _signer: any;

  constructor(privatePEM: any, publicP12PEM: any, password: any, assertionPsInfos: AssertionPsInfos) {
    this._assertionPsInfos = assertionPsInfos;
    this._publicP12PEM = publicP12PEM.toString()
      .replace('-----BEGIN CERTIFICATE-----', '')
      .replace('-----END CERTIFICATE-----', '')
      .replace(/(\r\n|\n|\r)/gm, '');

    this._signer = new SignedXml();
    this._signer.signatureAlgorithm = RSA_SHA256;
    this._signer.signingKey = { key: privatePEM, passphrase: password };
    this._signer.keyInfoProvider = {};
    this._signer.keyInfoProvider.getKeyInfo = () => `<ds:X509Data><ds:X509Certificate>${this._publicP12PEM}</ds:X509Certificate></ds:X509Data>`;
  }

  public postProcess(xml: string, envelopeKey: string = 'soap', options: AssertionPsOptions = {}) {
    const assertionID = options.id || `_${uuidv4()}`;
    const assertionTimeStamp = options.dateTime || generateDate();
    const secHeader =
      `<wsse:Security xmlns:wsse="${WSS_WSSECURITY_SECEXT}">` +
      `<saml:Assertion xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:xsi="${XML_SCHEMA_INSTANCE}" ID="${assertionID}" IssueInstant="${assertionTimeStamp}" Version="2.0" xsi:schemaLocation="urn:oasis:names:tc:SAML:2.0:assertion ${SAML_SCHEMA_ASSERTION_2_0}">` +
      `<saml:Issuer Format="urn:oasis:names:tc:SAML:1.1:nameid-format:X509SubjectName">${this._assertionPsInfos.issuer}</saml:Issuer>` +
      `<saml:Subject>` +
      `<saml:NameID NameQualifier="${this._assertionPsInfos.nameQualifier}">${this._assertionPsInfos.nameId}</saml:NameID>` +
      `</saml:Subject>` +
      `<saml:AttributeStatement>` +
      `<saml:Attribute Name="identifiantFacturation">` +
      `<saml:AttributeValue>${this._assertionPsInfos.identifiantFacturation}</saml:AttributeValue>` +
      `</saml:Attribute>` +
      `<saml:Attribute Name="codeSpecialiteAMO">` +
      `<saml:AttributeValue>${this._assertionPsInfos.codeSpecialiteAMO}</saml:AttributeValue>` +
      `</saml:Attribute>` +
      `<saml:Attribute Name="secteurActivite">` +
      `<saml:AttributeValue>${this._assertionPsInfos.secteurActivite}</saml:AttributeValue>` +
      `</saml:Attribute>` +
      `</saml:AttributeStatement>` +
      `</saml:Assertion>` +
      `</wsse:Security>`;
    const xmlWithSec = insertStr(secHeader, xml, xml.indexOf(`</${envelopeKey}:Header>`));

    this._signer.addReference(`//*[name(.)='saml:Assertion']`, [XMLDSIG_ENVELOPED_SIGNATURE, XML_EXC_C14], SHA256);
    this._signer.computeSignature(secHeader, { existingPrefixes: { wsse: WSS_WSSECURITY_SECEXT } });

    return insertStr(this._signer.getSignatureXml(), xmlWithSec, xmlWithSec.indexOf('</saml:Assertion>'));
  }
}
