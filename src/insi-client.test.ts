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
import { CRCodes, CRLabels, INSiFetchInsResponse } from './models/insi-fetch-ins.models';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: () => defaultUuid,
  validate: (uuid: string) => uuid === defaultUuid, 
}));

jest.mock('./class/bam-context.class', () => ({
  BamContext: jest.fn((config: { emitter: string }) => ({
    getSoapHeaderAsJson: (): BamContextSoapHeader => {
      const soapHeader = {
        ContexteBAM: {
          attributes: {
            Version: '01_02',
          },
          Id: uuidv4(),
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
          Id: uuidv4(),
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
  }, {
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
  });

  describe('Security: Pfx', () => {
    test('should be able to initClient without throwing error', async () => {
      await insiClient.initClientPfx(pfx, PASSPHRASE);
    });

    test('should be able to call fetchIns', async () => {
      const person = new INSiPerson({
        birthName: 'ADRTROIS',
        firstName: 'DOMINIQUE',
        gender: Gender.Female,
        dateOfBirth: '1997-02-26',
      });

      const {
        requestId,
        body,
        rawBody,
        bodyAsXMl,
        requestBodyAsXML,
      } = await insiClient.fetchIns(person, {
        requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
      });

      expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
      expect(body).toEqual(getAdrtroisDominiqueFormattedResponse());
      expect(rawBody).toEqual(getAdrtroisDominiqueRawResponse());
      expect(bodyAsXMl).toEqual(getAdrtroisDominiqueXmlResponse());
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

    test('should throw an INSi error if the software is not allowed', async () => {
      const lps = new LPS({
        idam: 'FAKE-IDAM',
        version: SOFTWARE_VERSION,
        name: SOFTWARE_NAME,
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

      await expect(async () => client.fetchIns(person)).rejects.toThrow('Numéro d\'autorisation du logiciel inconnu.');
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

      const {
        requestId,
        body,
        rawBody,
        bodyAsXMl,
      } = await insiCpxClient.fetchIns(person, {
        requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
      });

      expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
      expect(body).toEqual(getAdrtroisDominiqueFormattedResponse());
      expect(rawBody).toEqual(getAdrtroisDominiqueRawResponse());
      expect(bodyAsXMl).toEqual(getAdrtroisDominiqueXmlResponse());
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

      const {
        requestId,
        body,
        rawBody,
        bodyAsXMl,
        requestBodyAsXML,
      } = await insiClient.fetchIns(person, {
        requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
      });

      expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
      expect(body).toEqual(null);
      expect(rawBody).toEqual({
        CR: {
          CodeCR: CRCodes.MULTIPLE_MATCHES,
          LibelleCR: CRLabels.MULTIPLE_MATCHES,
        }
      });
      expect(bodyAsXMl).toEqual(getCR02XmlResponse());
    });

    test('should be able to call fetchIns with multiple names even if the first name fails', async () => {
      const person = new INSiPerson({
        birthName: 'TCHITCHI',
        firstName: 'OLA CATARINA BELLA',
        gender: Gender.Female,
        dateOfBirth: '1936-06-21',
      });

      const {
        requestId,
        body,
        rawBody,
        bodyAsXMl,
        requestBodyAsXML,
      } = await insiClient.fetchIns(person, {
        requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
      });

      expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
      expect(body).toEqual(getTchitchiFormattedResponse());
      expect(rawBody).toEqual(getTchitchiRawResponse());
      expect(bodyAsXMl).toEqual(getTchitchiXmlResponse());
      expect(requestBodyAsXML).toEqual(getCNDAValidationXmlRequest({
        idam: IDAM,
        version: SOFTWARE_VERSION,
        name: SOFTWARE_NAME,
        birthName: 'TCHITCHI',
        firstName: 'CATARINA',
        sexe: Gender.Female,
        dateOfBirth: '1936-06-21',
      }));
    });

    test('should be able to call fetchIns when its overridden for test_2.04 INSHISTO', async () => {
      const person = new INSiPerson({
        birthName: 'ECETINSI',
        firstName: 'PIERRE-ALAIN',
        gender: Gender.Male,
        dateOfBirth: '2009-07-14',
      });

      const {
        requestId,
        body,
        rawBody,
        bodyAsXMl,
        requestBodyAsXML,
      } = await insiClient.fetchIns(person, {
        requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
      });

      expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
      expect(body).toEqual(getPierreAlainFormattedResponse());
      expect(rawBody).toEqual(getPierreAlainRawResponse());
      expect(bodyAsXMl).toEqual(getPierreAlainXmlResponse());
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

      const {
        requestId,
        body,
        rawBody,
        bodyAsXMl,
        requestBodyAsXML,
      } = await client.fetchIns(person, { requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f' });

      expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
      expect(body).toEqual(getPierreAlainFormattedResponse());
      expect(rawBody).toEqual(getPierreAlainRawResponse({ liveVersion: true }));
      expect(bodyAsXMl).toEqual(getPierreAlainLiveXmlResponse());
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

    test('should be able to record failed attempts if the first name fails', async () => {
      const person = new INSiPerson({
        birthName: 'TCHITCHI',
        firstName: 'OLA CATARINA BELLA',
        gender: Gender.Female,
        dateOfBirth: '1936-06-21',
      });

      const failedInsRequests = (await insiClient.fetchIns(person, {
        requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
      })).failedRequests as unknown as INSiFetchInsResponse[];

      const {
        requestId,
        body,
        rawBody,
        bodyAsXMl,
        requestBodyAsXML,
      } = failedInsRequests[0];

      const expectedResponseAsXML = fs.readFileSync('src/fixtures/REP_CR01.xml', 'utf-8');

      expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
      expect(body).toEqual(null);
      expect(rawBody).toEqual({
        CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' },
      });
      expect(bodyAsXMl).toEqual(expectedResponseAsXML);
      expect(requestBodyAsXML).toEqual(getCNDAValidationXmlRequest({
        idam: IDAM,
        version: SOFTWARE_VERSION,
        name: SOFTWARE_NAME,
        birthName: 'TCHITCHI',
        firstName: 'OLA',
        sexe: Gender.Female,
        dateOfBirth: '1936-06-21',
      }));
    });

    test('should attempt all first names separately and all together at the end', async () => {
      const person = new INSiPerson({
        birthName: 'HOUILLES',
        firstName: 'PIERRE PAUL JACQUES',
        gender: Gender.Male,
        dateOfBirth: '1993-01-27',
      });

      const failedInsRequests = (await insiClient.fetchIns(person, {
        requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
      })).failedRequests as unknown as INSiFetchInsResponse[];

      const defaultExpectedResponseForHouilles = {
        idam: IDAM,
        version: SOFTWARE_VERSION,
        name: SOFTWARE_NAME,
        birthName: 'HOUILLES',
        sexe: Gender.Male,
        dateOfBirth: '1993-01-27',
      };

      expect(failedInsRequests[0].rawBody).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' }});
      expect(failedInsRequests[0].requestBodyAsXML).toEqual(getCNDAValidationXmlRequest({
        ...defaultExpectedResponseForHouilles,
        firstName: 'PIERRE',
      }));

      expect(failedInsRequests[1].rawBody).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' }});
      expect(failedInsRequests[1].requestBodyAsXML).toEqual(getCNDAValidationXmlRequest({
        ...defaultExpectedResponseForHouilles,
        firstName: 'PAUL',
      }));

      expect(failedInsRequests[2].rawBody).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' }});
      expect(failedInsRequests[2].requestBodyAsXML).toEqual(getCNDAValidationXmlRequest({
        ...defaultExpectedResponseForHouilles,
        firstName: 'JACQUES',
      }));

      expect(failedInsRequests[3].rawBody).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' }});
      expect(failedInsRequests[3].requestBodyAsXML).toEqual(getCNDAValidationXmlRequest({
        ...defaultExpectedResponseForHouilles,
        firstName: 'PIERRE PAUL JACQUES',
      }));
    });

    test('should throw an INSi error if the person does not exist', async () => {
      const person = new INSiPerson({
        birthName: 'ADRTROIS-DOES-NOT-EXIST',
        firstName: 'DOMINIQUE',
        gender: Gender.Female,
        dateOfBirth: '1997-02-26',
      });

      await expect(async () => insiClient.fetchIns(person)).rejects.toThrow('L\'appel au service de recherche avec la carte vitale renvoie une erreur technique.');
    });

    test('should respond with a CR01 code when the person is in the CR01 special case', async () => {
      const person = new INSiPerson({
        birthName: 'TCHITCHI',
        firstName: 'OLA',
        gender: Gender.Female,
        dateOfBirth: '1936-06-21',
      });

      const {
        requestId,
        body,
        rawBody,
        bodyAsXMl,
        requestBodyAsXML,
      } = await insiClient.fetchIns(person, {
        requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
      });

      const expectedResponseAsXML = fs.readFileSync('src/fixtures/REP_CR01.xml', 'utf-8');

      expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
      expect(body).toEqual(null);
      expect(rawBody).toEqual({
        CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' },
      });
      expect(bodyAsXMl).toEqual(expectedResponseAsXML);
      expect(requestBodyAsXML).toEqual(getCNDAValidationXmlRequest({
        idam: IDAM,
        version: SOFTWARE_VERSION,
        name: SOFTWARE_NAME,
        birthName: 'TCHITCHI',
        firstName: 'OLA',
        sexe: Gender.Female,
        dateOfBirth: '1936-06-21',
      }));
    });
  });
});
