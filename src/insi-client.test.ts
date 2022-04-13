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
   * You can test it locally by putting a valid assertion
   * */
  describe('Security: Cpx', () => {
    const assertionPs = `<Assertion xmlns="urn:oasis:names:tc:SAML:2.0:assertion" ID="_7731d686-0465-4bb2-9c37-ab1b2d83c9b9" IssueInstant="2022-04-13T09:31:02.660Z" Version="2.0"><Issuer Format="urn:oasis:names:tc:SAML:1.1:nameid-format:X509SubjectName">2.5.4.42=OLIVIER+CN=00B6087510+SN=INFIRMCS ADELI8751,T=Infirmier,C=FR</Issuer><Signature xmlns="http://www.w3.org/2000/09/xmldsig#"><SignedInfo><CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/><SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><Reference URI="#_7731d686-0465-4bb2-9c37-ab1b2d83c9b9"><Transforms><Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/><Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/></Transforms><DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><DigestValue>MEOeKPby8r2qOYhIWmuzWqPzdsNtfuu6wfypVkIXLcY=</DigestValue></Reference></SignedInfo><SignatureValue>NVlJjn4GTnwCX1F2ZMa6se9EBldj0alVFBSJrW1a/z5o7sVGk5b0GYKt6s04ZUBzS/9fMbBtk4q9ofEZQz6l8SvYORl0d3UAJcVsr21PMZpHEF2aRtIS8B3SZ64m7DUwhwN8dui2tZvLm/TCUdClUy3xZL7aybUcxGEQvZeXsFhXSQN2V3d3KKRyWY8KwCcOfK5claqUZwJs9ZjSdSuMqzc/VkV0ZrgpjPB25wngKjuqHi1Qo5a62xtF5Zakxs/7u/LwIj+OmljfaUV1s335J3ypYEYuCxQfpcRsjuvB8BCr9W7+laeB2lCtSnS1ccAClzT3Uu/iaEWfCudKtMxi0Q==</SignatureValue><KeyInfo><X509Data><X509Certificate>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</X509Certificate></X509Data></KeyInfo></Signature><Subject><NameID NameQualifier="CPS">00B6087510</NameID></Subject><AttributeStatement><Attribute Name="identifiantFacturation"><AttributeValue>123456789</AttributeValue></Attribute><Attribute Name="secteurActivite"><AttributeValue>SA05</AttributeValue></Attribute></AttributeStatement></Assertion>`;
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
