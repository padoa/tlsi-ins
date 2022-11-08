import { LPS } from './class/lps.class';
import { IDAM, PASSPHRASE, SOFTWARE_NAME, SOFTWARE_VERSION } from './models/env';
import { LpsContext, LpsContextSoapHeader } from './class/lps-context.class';
import { BamContext, BamContextSoapHeader } from './class/bam-context.class';
import { INSiClient } from './insi-client.service';
import { Gender, INSiPerson } from './class/insi-person.class';
import {
  getCR02XmlResponse,
  getCNDAValidationXmlRequest,
  defaultUuid,
  defaultDate,
} from './fixtures/insi-client.fixture';
import fs from 'fs';
import { CRCodes, CRLabels, INSiServiceRequestStatus } from './models/insi-fetch-ins.models';
import { getAdrtroisDominiqueResponse, getAdrtroisDominiqueXmlRequest } from './fixtures/persons/adrtrois-dominique.fixture';
import {
  getTchitchiCatarinaResponse,
  getTchitchiCatarinaXmlRequest,
  getTchitchiOlaXmlRequest,
} from './fixtures/persons/tchitchi-ola-catarina.fixture';
import { getDeVinciLeonardoXmlRequest } from './fixtures/persons/de-vinci-leonardo.fixture';
import {
  getPierreAlainFormattedResponse, getPierreAlainLiveXmlResponse,
  getPierreAlainRawResponse, getPierreAlainXmlRequest,
  getPierreAlainXmlResponse,
} from './fixtures/persons/pierre-alain.fixture';

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

const padoaConf = {
  idam: IDAM,
  version: SOFTWARE_VERSION,
  name: SOFTWARE_NAME,
};

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

      const [fetchRequest] = await insiClient.fetchIns(person, {
        requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
      });

      expect(fetchRequest).toEqual({
        status: INSiServiceRequestStatus.SUCCESS,
        request: {
          id: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
          xml: getAdrtroisDominiqueXmlRequest(padoaConf),
        },
        response: getAdrtroisDominiqueResponse(),
      });
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

      const [{ status, response }] = await client.fetchIns(person);
      expect(status).toEqual(INSiServiceRequestStatus.FAIL);
      expect(response.error).toEqual({
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

      const [{ status, request, response }] = await insiCpxClient.fetchIns(person, {
        requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
      });

      expect(status).toEqual(INSiServiceRequestStatus.SUCCESS);
      expect(request.id).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
      expect(response).toEqual(getAdrtroisDominiqueResponse());
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

      const [fetchRequest] = await insiClient.fetchIns(person, {
        requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
      });

      expect(fetchRequest).toEqual({
        status: INSiServiceRequestStatus.SUCCESS,
        request: {
          id: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
          xml: getDeVinciLeonardoXmlRequest(padoaConf),
        },
        response: {
          error: null,
          formatted: null,
          json: {
            CR: {
              CodeCR: CRCodes.MULTIPLE_MATCHES,
              LibelleCR: CRLabels.MULTIPLE_MATCHES,
            }
          },
          xml: getCR02XmlResponse(),
        },
      })
    });

    test('should be able to call fetchIns with multiple names even if the first name fails (OLA CATARINA BELLA)', async () => {
      const person = new INSiPerson({
        birthName: 'TCHITCHI',
        firstName: 'OLA CATARINA BELLA',
        gender: Gender.Female,
        dateOfBirth: '1936-06-21',
      });
      const requestId = 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
      const [firstFetchRequest, secondFetchRequest] = await insiClient.fetchIns(person, { requestId });
      const cr01XmlResponse = fs.readFileSync('src/fixtures/REP_CR01.xml', 'utf-8');

      expect(firstFetchRequest).toEqual({
        status: INSiServiceRequestStatus.SUCCESS,
        request: {
          id: requestId,
          xml: getTchitchiOlaXmlRequest(padoaConf),
        },
        response: {
          formatted: null,
          json: { CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' } },
          xml: cr01XmlResponse,
          error: null,
        }
      });

      expect(secondFetchRequest).toEqual({
        status: INSiServiceRequestStatus.SUCCESS,
        request: {
          id: requestId,
          xml: getTchitchiCatarinaXmlRequest(padoaConf),
        },
        response: getTchitchiCatarinaResponse(),
      });
    });

    test('should attempt all first names separately and all together at the end (PIERRE PAUL JACQUES)', async () => {
      const person = new INSiPerson({
        birthName: 'HOUILLES',
        firstName: 'PIERRE PAUL JACQUES',
        gender: Gender.Male,
        dateOfBirth: '1993-01-27',
      });
      const requestId = 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f';

      const [pierreFetchRequest, paulFetchRequest, jaquesFetchRequest, allNamesFetchRequest] = await insiClient.fetchIns(person, { requestId });

      const defaultExpectedResponseForHouilles = {
        idam: IDAM,
        version: SOFTWARE_VERSION,
        name: SOFTWARE_NAME,
        birthName: 'HOUILLES',
        sexe: Gender.Male,
        dateOfBirth: '1993-01-27',
      };

      expect(pierreFetchRequest.status).toEqual(INSiServiceRequestStatus.SUCCESS);
      expect(pierreFetchRequest.response.json).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' }});
      expect(pierreFetchRequest.request.xml).toEqual(getCNDAValidationXmlRequest({
        ...defaultExpectedResponseForHouilles,
        firstName: 'PIERRE',
      }));

      expect(paulFetchRequest.status).toEqual(INSiServiceRequestStatus.SUCCESS);
      expect(paulFetchRequest.response.json).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' }});
      expect(paulFetchRequest.request.xml).toEqual(getCNDAValidationXmlRequest({
        ...defaultExpectedResponseForHouilles,
        firstName: 'PAUL',
      }));

      expect(jaquesFetchRequest.status).toEqual(INSiServiceRequestStatus.SUCCESS);
      expect(jaquesFetchRequest.response.json).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' }});
      expect(jaquesFetchRequest.request.xml).toEqual(getCNDAValidationXmlRequest({
        ...defaultExpectedResponseForHouilles,
        firstName: 'JACQUES',
      }));

      expect(allNamesFetchRequest.status).toEqual(INSiServiceRequestStatus.SUCCESS);
      expect(allNamesFetchRequest.response.json).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' }});
      expect(allNamesFetchRequest.request.xml).toEqual(getCNDAValidationXmlRequest({
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

      const [fetchRequest] = await insiClient.fetchIns(person, {
        requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
      });

      expect(fetchRequest).toEqual({
        status: INSiServiceRequestStatus.SUCCESS,
        request: {
          id: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
          xml: getPierreAlainXmlRequest(padoaConf),
        },
        response: {
          formatted: getPierreAlainFormattedResponse(),
          json: getPierreAlainRawResponse(),
          xml: getPierreAlainXmlResponse(),
          error: null,
        },
      });
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

      const [fetchRequest] = await client.fetchIns(person, { requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f' });

      expect(fetchRequest).toEqual({
        status: INSiServiceRequestStatus.SUCCESS,
        request: {
          id: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
          xml: getPierreAlainXmlRequest(padoaConf),
        },
        response: {
          formatted: getPierreAlainFormattedResponse(),
          json: getPierreAlainRawResponse({ liveVersion: true }),
          xml: getPierreAlainLiveXmlResponse(),
          error: null,
        },
      });
    });

    test('should throw an INSi error if the person does not exist', async () => {
      const requestId = 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f';
      const person = new INSiPerson({
        birthName: 'ADRTROIS-DOES-NOT-EXIST',
        firstName: 'DOMINIQUE',
        gender: Gender.Female,
        dateOfBirth: '1997-02-26',
      });

      const [fetchRequest] = await insiClient.fetchIns(person, { requestId });
      const requestBodyAsXML = getCNDAValidationXmlRequest({
        idam: IDAM,
        version: SOFTWARE_VERSION,
        name: SOFTWARE_NAME,
        birthName: 'ADRTROIS-DOES-NOT-EXIST',
        firstName: 'DOMINIQUE',
        sexe: Gender.Female,
        dateOfBirth: '1997-02-26',
      })

      expect(fetchRequest).toEqual({
        status: INSiServiceRequestStatus.FAIL,
        request: {
          id: requestId,
          xml: requestBodyAsXML,
        },
        response: {
          formatted: null,
          json: null,
          xml: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\"><env:Body xmlns:S=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:env=\"http://www.w3.org/2003/05/soap-envelope\"><S:Fault xmlns:ns4=\"http://schemas.xmlsoap.org/soap/envelope/\"><S:Code><S:Value>S:Receiver</S:Value><S:Subcode><S:Value>S:siram_40</S:Value></S:Subcode></S:Code><S:Reason><S:Text xml:lang=\"en\">Le service est temporairement inaccessible.\nVeuillez renouveler votre demande ultérieurement. Si le problème persiste, contactez l'éditeur du progiciel ou votre responsable informatique.</S:Text></S:Reason><S:Detail><siram:Erreur severite=\"fatal\" code=\"insi_102\" xmlns:siram=\"urn:siram\">L appel au service de recherche avec les traits d identité renvoie une erreur technique.</siram:Erreur></S:Detail></S:Fault></env:Body></soap:Envelope>",
          error: {
            desirCode: 'insi_102',
            error: 'L appel au service de recherche avec les traits d identité renvoie une erreur technique.',
            siramCode: 'siram_40',
            text: 'Le service est temporairement inaccessible.\nVeuillez renouveler votre demande ultérieurement. Si le problème persiste, contactez l\'éditeur du progiciel ou votre responsable informatique.',
          },
        },
      });
    });
  });
});
