import fs from 'fs';
import path from 'path';
import { Client, ClientSSLSecurityPFX, createClientAsync, HttpClient } from 'soap';
import { v4 as uuidv4 } from 'uuid';
import { LpsContext } from './class/lps-context.class';
import { BamContext } from './class/bam-context.class';
import { INSiPerson } from './class/insi-person.class';
import { combineCertAsPem } from './utils/certificates';
import { INSiSoapActions, INSiSoapActionsName } from './models/insi-soap-action.models';
import { INSiFetchInsResponse, CRCodes } from './models/insi-fetch-ins.models';
import { InsiError } from './utils/insi-error';
import { InsiHelper } from './utils/insi-helper';
import { AssertionPsSecurityClass } from './class/assertionPsSecurity.class';
import { CR01_STAGING_ENV_CASES, TEST_2_04_STAGING_ENV_CASES, TEST_2_05_STAGING_ENV_CASES, TEST_2_08_01_STAGING_ENV_CASES, TEST_2_08_02_STAGING_ENV_CASES } from './models/insi-fetch-ins-special-cases.models';
import _ from 'lodash';

interface INSiClientArgs {
  lpsContext: LpsContext,
  bamContext: BamContext,
  overrideSpecialCases?: boolean,
}

export const INSi_CPX_TEST_URL = 'https://qualiflps.services-ps.ameli.fr:443/lps';
export const INSi_mTLS_TEST_URL = 'https://qualiflps-services-ps-tlsm.ameli.fr:443/lps';

/**
 * @constructor
 * @param  {INSiClientArgs} InsClientArguments contains the lpsContext and the bamContext
 */
export class INSiClient {
  private readonly _wsdlUrl: string = path.resolve(__dirname, '../wsdl/DESIR_ICIR_EXP_1.5.0.wsdl');
  private readonly _lpsContext: LpsContext;
  private readonly _bamContext: BamContext;

  private _soapClient: Client;
  private _overrideSpecialCases: boolean;
  private _httpClient: HttpClient;

  constructor({ lpsContext, bamContext, overrideSpecialCases }: INSiClientArgs) {
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
  public async initClientPfx(pfx: Buffer, passphrase: string = '', endpoint = INSi_mTLS_TEST_URL): Promise<void> {
    this._httpClient = new HttpClient();
    this._soapClient = await createClientAsync(this._wsdlUrl, {
      forceSoap12Headers: true, // use soap v1.2
      httpClient: this._httpClient,
    });
    this._soapClient.setEndpoint(endpoint);
    this._setClientSSLSecurityPFX(pfx, passphrase);
  }

  /**
   * Initializes a soap client and sets it's AssertionPsSecurity
   * @param  {string} assertionPs the assertion Ps to use for the call
   * @param  {string} endpoint service url, test by default
   * @returns Promise
   */
  public async initClientCpx(assertionPs: string, endpoint = INSi_CPX_TEST_URL): Promise<void> {
    this._httpClient = new HttpClient();
    this._soapClient = await createClientAsync(this._wsdlUrl, {
      forceSoap12Headers: true, // use soap v1.2
      httpClient: this._httpClient,
    });
    this._soapClient.setEndpoint(endpoint);
    this._setAssertionPsSecurity(assertionPs);
  }

  /**
   * Fetches INS information of a person
   * @param  {INSiPerson} person the person who's information are about to be fetched
   * @param  {string} requestId of the current request to Ins
   * @returns Promise<INSiFetchInsResponse>
   */
  public async fetchIns(person: INSiPerson, { requestId = uuidv4() } = {}): Promise<INSiFetchInsResponse> {
    if (!this._soapClient) {
      throw new Error('fetchIns ERROR: you must init client security first');
    }
    return this._launchSoapRequestForPerson(person, requestId);
  }

  private async _launchSoapRequestForPerson(person: INSiPerson, requestId: string): Promise<INSiFetchInsResponse> {
    let rawSoapResponse;
    const failedRequests = [];
    const namesToSendRequestFor = person.getSoapBodyAsJson();
    const { method } = INSiSoapActions[INSiSoapActionsName.FETCH_FROM_IDENTITY_TRAITS];
    const savedOverriddenHttpClientResponseHandler = this._httpClient.handleResponse;
    for (let i = 0; i < namesToSendRequestFor.length; i++) {
      this._setSoapHeaders(requestId);
      try {
        this._manageCndaValidationSpecialCases(namesToSendRequestFor[i].Prenom);
        rawSoapResponse = await this._soapClient[`${method}Async`](namesToSendRequestFor[i]);
        // reset the httpClient to the original one
        this._httpClient.handleResponse = savedOverriddenHttpClientResponseHandler;
        // in production environnement this error will not be thrown, but it will be a normal response, so we add it to the failed requests
        if (rawSoapResponse[0]?.CR?.CodeCR !== CRCodes.NO_RESULT) {
          this._soapClient.clearSoapHeaders();
          break;
        }
        failedRequests.push(this._getFetchResponseFromRawSoapResponse(rawSoapResponse, requestId));
      } catch (fetchError) {
        // reset the httpClient to the original one
        this._httpClient.handleResponse = savedOverriddenHttpClientResponseHandler;
        this._soapClient.clearSoapHeaders();
        const originalError = this._specificErrorManagement(fetchError) || fetchError;
        throw new InsiError({ requestId: requestId, originalError });
      }
      this._soapClient.clearSoapHeaders();
    }
    return {
      ...this._getFetchResponseFromRawSoapResponse(rawSoapResponse, requestId),
      failedRequests: failedRequests,
    };
  }

  private _setSoapHeaders(requestId: string): void {
    const { header } = INSiSoapActions[INSiSoapActionsName.FETCH_FROM_IDENTITY_TRAITS];
    this._setDefaultHeaders();
    this._soapClient.addSoapHeader(header, 'Action', 'wsa', 'http://www.w3.org/2005/08/addressing');
    this._soapClient.addSoapHeader({ MessageID: `uuid:${requestId}` }, 'MessageID', 'wsa', 'http://www.w3.org/2005/08/addressing');
    
  }

  private _getFetchResponseFromRawSoapResponse(rawSoapResponse: any, requestId: string): INSiFetchInsResponse {
    const [rawResponse, responseAsXMl, , requestAsXML] = rawSoapResponse;
    if (rawResponse?.INDIVIDU?.INSHISTO && !_.isArray(rawResponse?.INDIVIDU?.INSHISTO)) {
      rawResponse.INDIVIDU.INSHISTO = [rawResponse.INDIVIDU.INSHISTO];
    }
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

  private _setAssertionPsSecurity(assertionPs: string): void {
    this._soapClient.setSecurity(new AssertionPsSecurityClass(assertionPs, {
      ca: combineCertAsPem([
        path.resolve(__dirname, '../certificates/ca/ACR-EL.cer'),
        path.resolve(__dirname, '../certificates/ca/ACI-EL-ORG.cer'),
      ]),
    }));
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

  private _overrideHttpClientResponse(fileName: string): void {
    const copyOfHttpClient = { ...this._httpClient } as HttpClient;
    copyOfHttpClient.handleResponse = this._httpClient.handleResponse;
    this._httpClient.handleResponse = function (req, res, _body) {
      const overriddenBody = fs.readFileSync(path.resolve(__dirname, fileName), 'utf-8');
      return copyOfHttpClient.handleResponse(req, res, overriddenBody);
    };
  }

  private _manageCndaValidationSpecialCases(firstName: string): void {
    if (!this._overrideSpecialCases) { return }
    if (CR01_STAGING_ENV_CASES.includes(firstName)) {
      this._overrideHttpClientResponse('./fixtures/REP_CR01.xml');
    }
    if (TEST_2_04_STAGING_ENV_CASES.includes(firstName)) {
      this._overrideHttpClientResponse('./fixtures/TEST_2.04_cas2.xml');
    }
    if (TEST_2_05_STAGING_ENV_CASES.includes(firstName)) {
      this._overrideHttpClientResponse('./fixtures/TEST_2.05.xml');
    }
    if (TEST_2_08_01_STAGING_ENV_CASES.includes(firstName)) {
      this._overrideHttpClientResponse('./fixtures/TEST_2.08_cas1.xml');
    }
    if (TEST_2_08_02_STAGING_ENV_CASES.includes(firstName)) {
      this._overrideHttpClientResponse('./fixtures/TEST_2.08_cas2.xml');
    }
  }
}
