import { LPS } from './class/lps.class';
import { IDAM, PASSPHRASE, SOFTWARE_NAME, SOFTWARE_VERSION } from './models/env';
import { LpsContext } from './class/lps-context.class';
import { BamContext } from './class/bam-context.class';
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
} from './fixtures/insi-client.fixture';
import fs from 'fs';
import { CRCodes, CRLabels, getCR01XmlRequest, INSiFetchInsResponse } from './models/insi-fetch-ins.models';
import { assertionPs } from './fixtures/assertionPsSecurity.fixture';

const getClientWithDefinedId = (): INSiClient => {
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
  }, {
    id: '1f7425e2-b913-415c-adaa-785ee1076a70',
    dateTime: '2021-07-05T13:58:27.452Z',
  });

  const bamContext = new BamContext({
    emitter: 'medecin@yopmail.com',
  }, {
    id: 'c1a2ff23-fc05-4bd1-b500-1ec7d3178f1c',
    dateTime: '2021-07-05T13:58:27.452Z',
  });

  return new INSiClient({
    lpsContext,
    bamContext,
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
      const lps = new LPS({
        idam: IDAM,
        version: SOFTWARE_VERSION,
        name: SOFTWARE_NAME,
      });
      const lpsContext = new LpsContext({ emitter: 'medecin@yopmail.com', lps });
      const bamContext = new BamContext({ emitter: 'medecin@yopmail.com' });
      const client = new INSiClient({ lpsContext, bamContext, });
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
      const lps = new LPS({
        idam: IDAM,
        version: SOFTWARE_VERSION,
        name: SOFTWARE_NAME,
      });
      const lpsContext = new LpsContext({ emitter: 'medecin@yopmail.com', lps });
      const bamContext = new BamContext({ emitter: 'medecin@yopmail.com' });
      const client = new INSiClient({ lpsContext, bamContext, });
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
   * It cannot be a live test as the assertion expire after 1h
   * You can test it locally by putting a valid assertion in assertionPsSecurity.fixture
   * */
  describe.skip('Security: Cpx', () => {
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
        requestBodyAsXML,
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
      expect(requestBodyAsXML).toEqual(getCR01XmlRequest({
        idam: IDAM,
        version: SOFTWARE_VERSION,
        name: SOFTWARE_NAME,
        birthName: 'TCHITCHI',
        firstName: 'CATARINA',
        sexe: Gender.Female,
        dateOfBirth: '1936-06-21',
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
      expect(requestBodyAsXML).toEqual(getCR01XmlRequest({
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
      expect(failedInsRequests[0].requestBodyAsXML).toEqual(getCR01XmlRequest({
        ...defaultExpectedResponseForHouilles,
        firstName: 'PIERRE',
      }));

      expect(failedInsRequests[1].rawBody).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' }});
      expect(failedInsRequests[1].requestBodyAsXML).toEqual(getCR01XmlRequest({
        ...defaultExpectedResponseForHouilles,
        firstName: 'PAUL',
      }));

      expect(failedInsRequests[2].rawBody).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' }});
      expect(failedInsRequests[2].requestBodyAsXML).toEqual(getCR01XmlRequest({
        ...defaultExpectedResponseForHouilles,
        firstName: 'JACQUES',
      }));

      expect(failedInsRequests[3].rawBody).toEqual({ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' }});
      expect(failedInsRequests[3].requestBodyAsXML).toEqual(getCR01XmlRequest({
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
      expect(requestBodyAsXML).toEqual(getCR01XmlRequest({
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
