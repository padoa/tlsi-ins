import { LPS } from './class/lps.class';
import { IDAM, PASSPHRASE, SOFTWARE_NAME, SOFTWARE_VERSION } from './models/env';
import { LpsContext, LpsContextSoapHeader } from './class/lps-context.class';
import { BamContext, BamContextSoapHeader } from './class/bam-context.class';
import { INSiClient } from './insi-client.service';
import { Gender, INSiPerson } from './class/insi-person.class';
import {
  getAdrtroisDominiqueFormattedResponse,
  getAdrtroisDominiqueRawResponse,
  getAdrtroisDominiqueXmlResponse,
  getAdrtroisDominiqueXmlRequest,
  getTchitchiFormattedResponse,
  getTchitchiXmlResponse,
  getTchitchiRawResponse,
  getCR02XmlResponse,
  getCNDAValidationXmlRequest,
  getPierreAlainFormattedResponse,
  getPierreAlainRawResponse,
  getPierreAlainXmlResponse,
  getPierreAlainLiveXmlResponse,
  defaultUuid,
  defaultDate,
} from './fixtures/insi-client.fixture';
import fs from 'fs';
import { CRCodes, CRLabels, INSiServiceRequestStatus } from './models/insi-fetch-ins.models';

jest.mock('./class/bam-context.class', () => ({
  BamContext: jest.fn((config: { emitter: string }) => ({
    getSoapHeaderAsJson: (): BamContextSoapHeader => {
      const soapHeader = {
        ContexteBAM: {
          attributes: {
            Version: '01_02',
          },
          Id: defaultUuid,
          Temps: new Date(defaultDate).toISOString(),
          Emetteur: config.emitter,
          COUVERTURE: {},
        },
      };
      const name = 'ContexteBAM';
      const namespace = 'ctxbam';
      return { soapHeader, name, namespace };
    },
  })),
}));

jest.mock('./class/lps-context.class', () => ({
  LpsContext: jest.fn((config: { emitter: string, lps: LPS }) => ({
    getSoapHeaderAsJson: (): LpsContextSoapHeader => {
      const soapHeader = {
        ContexteLPS: {
          attributes: {
            Nature: 'CTXLPS',
            Version: '01_00',
          },
          Id: defaultUuid,
          Temps: new Date(defaultDate).toISOString(),
          Emetteur: config.emitter,
          LPS: config.lps.getSoapHeaderAsJson(),
        }
      };
      const name = 'ContexteLPS';
      const namespace = 'ctxlps';
      return { soapHeader, name, namespace };
    },
  })),
}));


const getClientWithDefinedId = (overrideSpecialCases = true): INSiClient => {
  const lps = new LPS({
    idam: IDAM,
    version: SOFTWARE_VERSION,
    name: SOFTWARE_NAME,
    id: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
  });

  const lpsContext = new LpsContext({
    emitter: 'medecin@yopmail.com',
    lps,
  });

  const bamContext = new BamContext({
    emitter: 'medecin@yopmail.com',
  });

  return new INSiClient({
    lpsContext,
    bamContext,
    overrideSpecialCases,
  });
};

describe('INSi Client', () => {
  const pfx = fs.readFileSync('certificates/INSI-AUTO/AUTO-certificate.p12');
  let insiClient: INSiClient;

  describe('Initialisation', () => {
    test('should be able to create a new INSi client without throwing', () => {
      insiClient = getClientWithDefinedId();
    });

    test('should throw an error if calling fetchInsi without initClient first', async () => {
      const person = new INSiPerson({
        birthName: 'ADRTROIS',
        firstName: 'DOMINIQUE',
        gender: Gender.Female,
        dateOfBirth: '1997-02-26',
      });
      await expect(async () => insiClient.fetchIns(person)).rejects.toThrow('fetchIns ERROR: you must init client security first');
    });

    test('should be able to initClient without throwing error', async () => {
      await insiClient.initClientPfx(pfx, PASSPHRASE);
    });
  });

  describe('Security: Pfx', () => {
    test('should be able to call fetchIns', async () => {
      const person = new INSiPerson({
        birthName: 'ADRTROIS',
        firstName: 'DOMINIQUE',
        gender: Gender.Female,
        dateOfBirth: '1997-02-26',
      });

      const [{
        status,
        requestId,
        response,
        responseBodyAsJson,
        responseBodyAsXml,
        requestBodyAsXML,
      }] = await insiClient.fetchIns(person, {
        requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
      });

      expect(status).toEqual(INSiServiceRequestStatus.SUCCESS);
      expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
      expect(response).toEqual(getAdrtroisDominiqueFormattedResponse());
      expect(responseBodyAsJson).toEqual(getAdrtroisDominiqueRawResponse());
      expect(responseBodyAsXml).toEqual(getAdrtroisDominiqueXmlResponse());
      expect(requestBodyAsXML).toEqual(getAdrtroisDominiqueXmlRequest({
        idam: IDAM,
        version: SOFTWARE_VERSION,
        name: SOFTWARE_NAME,
      }));
    });

    test('should throw an INSi error if the pfx is not a correct pfx file', async () => {
      const client = getClientWithDefinedId();
      const fakePfx = fs.readFileSync('certificates/INSI-AUTO/AUTO-certificate-fake.p12');
      await client.initClientPfx(fakePfx, PASSPHRASE);
      const person = new INSiPerson({
        birthName: 'ADRTROIS',
        firstName: 'DOMINIQUE',
        gender: Gender.Female,
        dateOfBirth: '1997-02-26',
      });

      await expect(async () => client.fetchIns(person)).rejects.toThrow('Le fichier pfx fourni n\'est pas un fichier pfx valid');
    });

    test('should throw an INSi error if the Passe phrase is not a correct', async () => {
      const client = getClientWithDefinedId();
      await client.initClientPfx(pfx, 'fake-pass-phrase');
      const person = new INSiPerson({
        birthName: 'ADRTROIS',
        firstName: 'DOMINIQUE',
        gender: Gender.Female,
        dateOfBirth: '1997-02-26',
      });

      await expect(async () => client.fetchIns(person)).rejects.toThrow('La passe phrase n\'est pas correct');
    });

    test('should have a failed request if the software is not allowed', async () => {
      const lps = new LPS({
        idam: 'FAKE-IDAM',
        version: SOFTWARE_VERSION,
        name: SOFTWARE_NAME,
        id: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
      });
      const lpsContext = new LpsContext({ emitter: 'medecin@yopmail.com', lps });
      const bamContext = new BamContext({ emitter: 'medecin@yopmail.com' });
      const client = new INSiClient({ lpsContext, bamContext, });
      await client.initClientPfx(pfx, PASSPHRASE);
      const person = new INSiPerson({
        birthName: 'ADRTROIS',
        firstName: 'DOMINIQUE',
        gender: Gender.Female,
        dateOfBirth: '1997-02-26',
      });

      const [{ status, error }] = await client.fetchIns(person);
      expect(status).toEqual(INSiServiceRequestStatus.FAIL);
      expect(error).toEqual({
        siramCode: 'siram_100',
        text: "L'accès par ce progiciel au service n'est pas autorisé. Contactez l'éditeur du progiciel ou votre responsable informatique.",
        desirCode: 'desir_550',
        error: "Numéro d'autorisation du logiciel inconnu."
      });
    });
  });

  /**
   * KEEP IT SKIPPED
   * It cannot be a live test as the assertion expires after 1h
   * You can test it locally by putting a valid assertion
   * */
  describe.skip('Security: Cpx', () => {
    const assertionPs = `PUT ASSERTION HERE`;
    let insiCpxClient: INSiClient;
    test('should create an insiClient with an AssertionPsSecurityClass', async () => {
      insiCpxClient = getClientWithDefinedId();
      await insiCpxClient.initClientCpx(assertionPs);
    });

    test('should be able to call fetchIns', async () => {
      const person = new INSiPerson({
        birthName: 'ADRTROIS',
        firstName: 'DOMINIQUE',
        gender: Gender.Female,
        dateOfBirth: '1997-02-26',
      });

      const [{
        status,
        requestId,
        response,
        responseBodyAsJson,
        responseBodyAsXml,
      }] = await insiCpxClient.fetchIns(person, {
        requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
      });

      expect(status).toEqual(INSiServiceRequestStatus.SUCCESS);
      expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
      expect(response).toEqual(getAdrtroisDominiqueFormattedResponse());
      expect(responseBodyAsJson).toEqual(getAdrtroisDominiqueRawResponse());
      expect(responseBodyAsXml).toEqual(getAdrtroisDominiqueXmlResponse());
    });
  });

  describe('Use case and INS-i Errors (PfxSecurity Used)', () => {
    test('should respond with CR02 code when multiple identities are found', async () => {
      const person = new INSiPerson({
        birthName: 'DE VINCI',
        firstName: 'LEONARDO',
        gender: Gender.Male,
        dateOfBirth: '2014-02-01',
      });

      const [{
        status,
        requestId,
        response,
        responseBodyAsJson,
        responseBodyAsXml,
      }] = await insiClient.fetchIns(person, {
        requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
      });

      expect(status).toEqual(INSiServiceRequestStatus.SUCCESS);
      expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
      expect(response).toEqual(null);
      expect(responseBodyAsJson).toEqual({
        CR: {
          CodeCR: CRCodes.MULTIPLE_MATCHES,
          LibelleCR: CRLabels.MULTIPLE_MATCHES,
        }
      });
      expect(responseBodyAsXml).toEqual(getCR02XmlResponse());
    });

    test('should be able to call fetchIns with multiple names even if the first name fails (OLA CATARINA BELLA)', async () => {
      const person = new INSiPerson({
        birthName: 'TCHITCHI',
        firstName: 'OLA CATARINA BELLA',
        gender: Gender.Female,
        dateOfBirth: '1936-06-21',
      });
      const requestId = 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
      const [firstResult, secondResult] = await insiClient.fetchIns(person, { requestId });
      const expectedResponseAsXML = fs.readFileSync('src/fixtures/REP_CR01.xml', 'utf-8');

      expect(firstResult.status).toEqual(INSiServiceRequestStatus.SUCCESS);
      expect(firstResult.requestId).toEqual(requestId);
      expect(firstResult.response).toEqual(null);
      expect(firstResult.responseBodyAsJson).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' } });
      expect(firstResult.responseBodyAsXml).toEqual(expectedResponseAsXML);
      expect(firstResult.requestBodyAsXML).toEqual(getCNDAValidationXmlRequest({
        idam: IDAM,
        version: SOFTWARE_VERSION,
        name: SOFTWARE_NAME,
        birthName: 'TCHITCHI',
        firstName: 'OLA',
        sexe: Gender.Female,
        dateOfBirth: '1936-06-21',
      }));

      expect(secondResult.status).toEqual(INSiServiceRequestStatus.SUCCESS);
      expect(secondResult.requestId).toEqual(requestId);
      expect(secondResult.response).toEqual(getTchitchiFormattedResponse());
      expect(secondResult.responseBodyAsJson).toEqual(getTchitchiRawResponse());
      expect(secondResult.responseBodyAsXml).toEqual(getTchitchiXmlResponse());
      expect(secondResult.requestBodyAsXML).toEqual(getCNDAValidationXmlRequest({
        idam: IDAM,
        version: SOFTWARE_VERSION,
        name: SOFTWARE_NAME,
        birthName: 'TCHITCHI',
        firstName: 'CATARINA',
        sexe: Gender.Female,
        dateOfBirth: '1936-06-21',
      }));
    });

    test('should attempt all first names separately and all together at the end (PIERRE PAUL JACQUES)', async () => {
      const person = new INSiPerson({
        birthName: 'HOUILLES',
        firstName: 'PIERRE PAUL JACQUES',
        gender: Gender.Male,
        dateOfBirth: '1993-01-27',
      });
      const requestId = 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f';

      const [pierreResponse, paulResponse, jaquesResponse, allNamesResponse] = await insiClient.fetchIns(person, { requestId });

      const defaultExpectedResponseForHouilles = {
        idam: IDAM,
        version: SOFTWARE_VERSION,
        name: SOFTWARE_NAME,
        birthName: 'HOUILLES',
        sexe: Gender.Male,
        dateOfBirth: '1993-01-27',
      };

      expect(pierreResponse.responseBodyAsJson).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' }});
      expect(pierreResponse.requestBodyAsXML).toEqual(getCNDAValidationXmlRequest({
        ...defaultExpectedResponseForHouilles,
        firstName: 'PIERRE',
      }));

      expect(paulResponse.responseBodyAsJson).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' }});
      expect(paulResponse.requestBodyAsXML).toEqual(getCNDAValidationXmlRequest({
        ...defaultExpectedResponseForHouilles,
        firstName: 'PAUL',
      }));

      expect(jaquesResponse.responseBodyAsJson).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' }});
      expect(jaquesResponse.requestBodyAsXML).toEqual(getCNDAValidationXmlRequest({
        ...defaultExpectedResponseForHouilles,
        firstName: 'JACQUES',
      }));

      expect(allNamesResponse.responseBodyAsJson).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' }});
      expect(allNamesResponse.requestBodyAsXML).toEqual(getCNDAValidationXmlRequest({
        ...defaultExpectedResponseForHouilles,
        firstName: 'PIERRE PAUL JACQUES',
      }));
    });

    test('should be able to call fetchIns when its overridden for test_2.04 INSHISTO', async () => {
      const person = new INSiPerson({
        birthName: 'ECETINSI',
        firstName: 'PIERRE-ALAIN',
        gender: Gender.Male,
        dateOfBirth: '2009-07-14',
      });

      const [{
        requestId,
        response,
        responseBodyAsJson,
        responseBodyAsXml,
        requestBodyAsXML,
      }] = await insiClient.fetchIns(person, {
        requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
      });

      expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
      expect(response).toEqual(getPierreAlainFormattedResponse());
      expect(responseBodyAsJson).toEqual(getPierreAlainRawResponse());
      expect(responseBodyAsXml).toEqual(getPierreAlainXmlResponse());
      expect(requestBodyAsXML).toEqual(getCNDAValidationXmlRequest({
        idam: IDAM,
        version: SOFTWARE_VERSION,
        name: SOFTWARE_NAME,
        birthName: 'ECETINSI',
        firstName: 'PIERRE-ALAIN',
        sexe: Gender.Male,
        dateOfBirth: '2009-07-14',
      }));
    });

    test('should handle single INSHISTO as an array, test_2.04 LIVE', async () => {
      const client = getClientWithDefinedId(false);
      await client.initClientPfx(pfx, PASSPHRASE);
      const person = new INSiPerson({
        birthName: 'ECETINSI',
        firstName: 'PIERRE-ALAIN',
        gender: Gender.Male,
        dateOfBirth: '2009-07-14',
      });

      const [{
        requestId,
        response,
        responseBodyAsJson,
        responseBodyAsXml,
        requestBodyAsXML,
      }] = await client.fetchIns(person, { requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f' });

      expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
      expect(response).toEqual(getPierreAlainFormattedResponse());
      expect(responseBodyAsJson).toEqual(getPierreAlainRawResponse({ liveVersion: true }));
      expect(responseBodyAsXml).toEqual(getPierreAlainLiveXmlResponse());
      expect(requestBodyAsXML).toEqual(getCNDAValidationXmlRequest({
        idam: IDAM,
        version: SOFTWARE_VERSION,
        name: SOFTWARE_NAME,
        birthName: 'ECETINSI',
        firstName: 'PIERRE-ALAIN',
        sexe: Gender.Male,
        dateOfBirth: '2009-07-14',
      }));
    });

    test('should throw an INSi error if the person does not exist', async () => {
      const requestId = 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f';
      const person = new INSiPerson({
        birthName: 'ADRTROIS-DOES-NOT-EXIST',
        firstName: 'DOMINIQUE',
        gender: Gender.Female,
        dateOfBirth: '1997-02-26',
      });

      const [response] = await insiClient.fetchIns(person, { requestId });
      const requestBodyAsXML = getCNDAValidationXmlRequest({
        idam: IDAM,
        version: SOFTWARE_VERSION,
        name: SOFTWARE_NAME,
        birthName: 'ADRTROIS-DOES-NOT-EXIST',
        firstName: 'DOMINIQUE',
        sexe: Gender.Female,
        dateOfBirth: '1997-02-26',
      })

      expect(response).toEqual({
        status: INSiServiceRequestStatus.FAIL,
        error: {
          desirCode: 'insi_102',
          error: 'L appel au service de recherche avec les traits d identité renvoie une erreur technique.',
          siramCode: 'siram_40',
          text: 'Le service est temporairement inaccessible.\nVeuillez renouveler votre demande ultérieurement. Si le problème persiste, contactez l\'éditeur du progiciel ou votre responsable informatique.',
        },
        requestBodyAsXML,
        requestId,
        response: null,
        responseBodyAsJson: null,
        responseBodyAsXml: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\"><env:Body xmlns:S=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:env=\"http://www.w3.org/2003/05/soap-envelope\"><S:Fault xmlns:ns4=\"http://schemas.xmlsoap.org/soap/envelope/\"><S:Code><S:Value>S:Receiver</S:Value><S:Subcode><S:Value>S:siram_40</S:Value></S:Subcode></S:Code><S:Reason><S:Text xml:lang=\"en\">Le service est temporairement inaccessible.\nVeuillez renouveler votre demande ultérieurement. Si le problème persiste, contactez l'éditeur du progiciel ou votre responsable informatique.</S:Text></S:Reason><S:Detail><siram:Erreur severite=\"fatal\" code=\"insi_102\" xmlns:siram=\"urn:siram\">L appel au service de recherche avec les traits d identité renvoie une erreur technique.</siram:Erreur></S:Detail></S:Fault></env:Body></soap:Envelope>",
      });
    });
  });
});
