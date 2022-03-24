import fs from 'fs';
import path from 'path';
import { Client, ClientSSLSecurityPFX, createClientAsync } from 'soap';
import { v4 as uuidv4 } from 'uuid';
import { LpsContext } from './class/lps-context.class';
import { BamContext } from './class/bam-context.class';
import { INSiPerson } from './class/insi-person.class';
import { combineCertAsPem } from './utils/certificates';
import { INSiSoapActions, INSiSoapActionsName } from './models/insi-soap-action.models';
import { INSiFetchInsResponse, getCR01XmlRequest } from './models/insi-fetch-ins.models';
import { InsiError } from './utils/insi-error';
import { InsiHelper } from './utils/insi-helper';
import { AssertionPsInfos, AssertionPsSecurityClass } from './class/assertionPsSecurity.class';
import { IDAM, SOFTWARE_VERSION, SOFTWARE_NAME } from './models/env';

interface INSiClientArgs {
  lpsContext: LpsContext,
  bamContext: BamContext,
}

/**
 * @constructor
 * @param  {INSiClientArgs} InsClientArguments contains the lpsContext and the bamContext
 */
export class INSiClient {
  private readonly _wsdlUrl: string = path.resolve(__dirname, '../wsdl/DESIR_ICIR_EXP_1.5.0.wsdl');
  private readonly _lpsContext: LpsContext;
  private readonly _bamContext: BamContext;

  private _soapClient: Client;

  constructor({ lpsContext, bamContext }: INSiClientArgs) {
    this._lpsContext = lpsContext;
    this._bamContext = bamContext;
  }

  /**
   * Initializes a soap client and sets it's SSLSecurityPFX TLS authentication
   * @param  {Buffer} pfx contains the SSL certificate (public keys) and the corresponding private keys
   * @param  {string=''} passphrase needed for the pfx
   * @returns Promise
   */
  public async initClientPfx(pfx: Buffer, passphrase: string = ''): Promise<void> {
    this._soapClient = await createClientAsync(this._wsdlUrl, {
      forceSoap12Headers: true, // use soap v1.2
    });
    this._setClientSSLSecurityPFX(pfx, passphrase);
  }

  /**
   * Initializes a soap client and sets it's AssertionPsSecurity
   * @param  {string} privateKey the private key for certificate sign
   * @param  {string} publicKey the associated public key
   * @param  {string=''} password of the privateKey if needed
   * @param  {AssertionPsInfos} assertionPsInfos infos of the PS (Personel de Santé) that needed to build the assertion
   * @returns Promise
   */
  public async initClientCpx(privateKey: string, publicKey: string, password: string = '', assertionPsInfos: AssertionPsInfos): Promise<void> {
    this._soapClient = await createClientAsync(this._wsdlUrl, {
      forceSoap12Headers: true, // use soap v1.2
    });

    this._setAssertionPsSecurity(privateKey, publicKey, password, assertionPsInfos);
  }

  /**
   * Fetches INS information of a person
   * @param  {INSiPerson} person the person who's information are about to be fetched
   * @param  {string} requestId of the current request to Ins
   * @returns Promise<INSiFetchInsResponse>
   */
  public async fetchIns(person: INSiPerson, { requestId = uuidv4() } = {}): Promise<INSiFetchInsResponse> {
    if (!this._soapClient) {
      throw new Error('fetchIns ERROR: you must init client first');
    }
    const { header, method } = INSiSoapActions[INSiSoapActionsName.FETCH_FROM_IDENTITY_TRAITS];
    this._setDefaultHeaders();
    this._soapClient.addSoapHeader(header, 'Action', 'wsa', 'http://www.w3.org/2005/08/addressing');
    this._soapClient.addSoapHeader({ MessageID: requestId, }, 'MessageID', 'wsa', 'http://www.w3.org/2005/08/addressing');

    let rawSoapResponse;
    try {
      rawSoapResponse = await this._soapClient[`${method}Async`](person.getSoapBodyAsJson());
    }
    catch (fetchError) {
      if (person.isCR01SpecialCase()) {
        rawSoapResponse = this._getCR01Response(person);
      } else {
        const originalError = this._specificErrorManagement(fetchError) || fetchError;
        throw new InsiError({ requestId: requestId, originalError });
      }
    }
    finally {
      this._soapClient.clearSoapHeaders();
    }
    const [rawResponse, responseAsXMl, , requestAsXML] = rawSoapResponse;
    return {
      requestId,
      rawBody: rawResponse,
      body: InsiHelper.formatFetchINSRawResponse(rawResponse),
      bodyAsXMl: responseAsXMl,
      requestBodyAsXML: requestAsXML,
    };
  }

  private _setClientSSLSecurityPFX(pfx: Buffer, passphrase?: string): void {
    this._soapClient.setSecurity(new ClientSSLSecurityPFX(pfx, {
      passphrase,
      ca: combineCertAsPem([
        path.resolve(__dirname, '../certificates/ca/ACR-EL.cer'),
        path.resolve(__dirname, '../certificates/ca/ACI-EL-ORG.cer'),
      ]),
    }))
  }

  private _setAssertionPsSecurity(privateKey: string, publicKey: string, password: string, assertionPsInfos: AssertionPsInfos): void {
    const assertionPs = new AssertionPsSecurityClass(privateKey, publicKey, password, assertionPsInfos);
    this._soapClient.setSecurity(assertionPs);
  }

  private _setDefaultHeaders(): void {
    const { soapHeader: bamSoapHeader, name: bamName, namespace: bamNamespace } = this._bamContext.getSoapHeaderAsJson();
    this._soapClient.addSoapHeader(bamSoapHeader, bamName, bamNamespace);
    const { soapHeader: lpsSoapHeader, name: lpsName, namespace: lpsNamespace } = this._lpsContext.getSoapHeaderAsJson()
    this._soapClient.addSoapHeader(lpsSoapHeader, lpsName, lpsNamespace);
  }

  private _specificErrorManagement(error: any): { body: string} | undefined {
    if (error.toString().includes('not enough data')) {
      return { body: 'Le fichier pfx fourni n\'est pas un fichier pfx valid' };
    }
    if (error.toString().includes('mac verify failure')) {
      return { body: 'La passe phrase n\'est pas correct' };
    }
    if(error.body) {
      /**
       * The INSi service returns an xml response with a tag <siram:Erreur> which contains the error
       * we catch this error and send it
      */
      return { body: error.body.match(/(<siram:Erreur(.*)>)(.*)(<\/siram:Erreur>)/)[3] };
    }
    return error.toString().length > 0 ? { body: error.toString() } : undefined;
  }

  private _getCR01Response(person: INSiPerson): any {
    const { birthName, firstName, gender, dateOfBirth } = person.getPerson();
    const requestAsXML = getCR01XmlRequest({
      idam: IDAM,
      version: SOFTWARE_VERSION,
      name: SOFTWARE_NAME,
      birthName,
      firstName,
      sexe: gender,
      dateOfBirth,
    });
    const rawResponse = {
      CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' },
    };
    const responseAsXML = fs.readFileSync('src/fixtures/REP_CR01.xml', 'utf-8');
    return [rawResponse, responseAsXML, undefined, requestAsXML];
  }
}
