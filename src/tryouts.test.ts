import fs from 'fs';
import { validate as validateUUID } from 'uuid';
import { combineCACertAsPem, readCACertAsPem } from './utils/certificates';
import { IDAM, PASSPHRASE, SOFTWARE_NAME, SOFTWARE_VERSION } from './models/env';
import { INSiClient } from './insi-client.service';
import { LPS } from './class/lps.class';
import { LpsContext } from './class/lps-context.class';
import { BamContext } from './class/bam-context.class';
import { Gender, INSiPerson } from './class/insi-person.class';
import {
  getAdrtroisDominiqueJsonResponse,
  getAdrtroisDominiqueXmlResponse,
  getAdrtroisDominiqueXmlResquest,
} from './tryouts.fixtures';

describe('Convert CA cert to PEM', () => {
  // Make sure we are compatible with Windows line endings
  const ACI_EL_ORG_PEM_CERTIFICATE = fs.readFileSync('src/fixtures/ACI_EL_ORG_PEM_CERTIFICATE.pem.fixture', 'utf-8').replace(/\n/g, '\r\n');
  const ACR_EL_PEM_CERTIFICATE = fs.readFileSync('src/fixtures/ACR_EL_PEM_CERTIFICATE.pem.fixture', 'utf-8').replace(/\n/g, '\r\n');

  test('convert a single file', () => {
    const pem = readCACertAsPem('certificates/ca/ACI-EL-ORG.cer');

    expect(pem).toStrictEqual(ACI_EL_ORG_PEM_CERTIFICATE);
  });

  test('convert multiple files and concat', () => {
    const certChain = combineCACertAsPem([
      'certificates/ca/ACI-EL-ORG.cer',
      'certificates/ca/ACR-EL.cer',
    ]);
    const expected = [
      ACI_EL_ORG_PEM_CERTIFICATE,
      ACR_EL_PEM_CERTIFICATE,
    ].join('');
    expect(certChain).toEqual(expected);
  });
});

const pfx = fs.readFileSync('certificates/INSI-AUTO/AUTO-certificate.p12');

describe('INSi client', () => {
  let lps: LPS;
  let insiClient: INSiClient;

  describe('LPS class', () => {
    test('should be able to create an LPS and get his header as json', () => {
      lps = new LPS({
        idam: 'GDF1TNF51DK9',
        version: '2022',
        name: 'docto-solution',
      }, {
        id: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
      });

      expect(lps.getSoapHeaderAsJson()).toEqual({
        IDAM: {
          attributes: { R: 4 },
          $value: 'GDF1TNF51DK9',
        },
        Version: '2022',
        Instance: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
        Nom: 'docto-solution',
      });
    });

    test('should generate a valid UUID as id', () => {
      const myLps = new LPS({
        idam: 'GDF1TNF51DK9',
        version: '2022',
        name: 'docto-solution',
      });

      expect(validateUUID(myLps.id));
    });

    test('should not be able to create an LPS if empty IDAM', () => {
      expect(() => {
        new LPS({
          idam: '',
          version: '2022',
          name: 'docto-solution',
        });
      }).toThrow('Fail to create a LPS, you must provide an idam');
    });

    test('should not be able to create an LPS if empty version', () => {
      expect(() => {
        new LPS({
          idam: 'GDF1TNF51DK9',
          version: '',
          name: 'docto-solution',
        });
      }).toThrow('Fail to create a LPS, you must provide a version');
    });

    test('should not be able to create an LPS if empty name', () => {
      expect(() => {
        new LPS({
          idam: 'GDF1TNF51DK9',
          version: '2022',
          name: '',
        });
      }).toThrow('Fail to create a LPS, you must provide a name');
    });
  });

  describe('LPS Context', () => {
    test('should be able to create an LPS Context and get his header as json', () => {
      const lpsContext = new LpsContext({
        emitter: 'medecin@yopmail.com',
        lps,
      }, {
        id: '1f7425e2-b913-415c-adaa-785ee1076a70',
        dateTime: '2021-07-05T13:58:27.452Z',
      });

      const { soapHeader, name, namespace } = lpsContext.getSoapHeaderAsJson();
      expect(name).toEqual('ContexteLPS');
      expect(namespace).toEqual('ctxlps');
      expect(soapHeader).toEqual({
        ContexteLPS: {
          attributes: {
            Nature: 'CTXLPS',
            Version: '01_00',
          },
          Id: '1f7425e2-b913-415c-adaa-785ee1076a70',
          Temps: '2021-07-05T13:58:27.452Z',
          Emetteur: 'medecin@yopmail.com',
          LPS: {
            IDAM: {
              attributes: { R: 4 },
              $value: 'GDF1TNF51DK9',
            },
            Version: '2022',
            Instance: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
            Nom: 'docto-solution',
          },
        }
      });
    });

    test('should generate a valid UUID as id', () => {
      const myLpsContext = new LpsContext({ emitter: 'medecin@yopmail.com', lps });
      expect(validateUUID(myLpsContext.id));
    });

    test('should generate dateTime in ISO Format', () => {
      const myLpsContext = new LpsContext({ emitter: 'medecin@yopmail.com', lps });
      expect(new Date(myLpsContext.dateTime).toISOString()).toEqual(myLpsContext.dateTime);
    });

    test('should not be able to create an LPS Context if empty emitter', () => {
      expect(() => {
        new LpsContext({ emitter: '', lps });
      }).toThrow('Fail to create a LpsContext, you must provide an emitter');
    });
  });

  describe('BAM Context', () => {
    test('should be able to create a BAM Context and get his header as json', () => {
      const bamContext = new BamContext({
        emitter: 'medecin@yopmail.com',
      }, {
        id: '1f7425e2-b913-415c-adaa-785ee1076a70',
        dateTime: '2021-07-05T13:58:27.452Z',
      });

      const { soapHeader, name, namespace } = bamContext.getSoapHeaderAsJson();
      expect(name).toEqual('ContexteBAM');
      expect(namespace).toEqual('ctxbam');

      expect(soapHeader).toEqual({
        ContexteBAM: {
          attributes: {
            Version: '01_02',
          },
          Id: '1f7425e2-b913-415c-adaa-785ee1076a70',
          Temps: '2021-07-05T13:58:27.452Z',
          Emetteur: 'medecin@yopmail.com',
          COUVERTURE: {},
        },
      });
    });

    test('should generate a valid UUID as id', () => {
      const myBamContext = new BamContext({ emitter: 'medecin@yopmail.com' });
      expect(validateUUID(myBamContext.id));
    });

    test('should generate dateTime in ISO Format', () => {
      const myBamContext = new BamContext({ emitter: 'medecin@yopmail.com' });
      expect(new Date(myBamContext.dateTime).toISOString()).toEqual(myBamContext.dateTime);
    });

    test('should not be able to create an Bam Context if empty emitter', () => {
      expect(() => {
        new BamContext({ emitter: '' });
      }).toThrow('Fail to create a BamContext, you must provide an emitter');
    });
  });

  describe('INSi Person', () => {
    test('should be able to create an INSi Person and get his data as json', () => {
      const insiPerson = new INSiPerson({
        formerName: 'Dampierre',
        firstName: 'Eric',
        gender: Gender.Male,
        birthDate: '1990-01-01',
        birthPlaceCode: '20020',
      });

      expect(insiPerson.getSoapDataAsJson()).toEqual({
        NomNaissance: 'Dampierre',
        Prenom: 'Eric',
        Sexe: Gender.Male,
        DateNaissance: '1990-01-01',
        LieuNaissance: '20020',
      });
    });

    test('should be able to create an INSi Person without birthPlaceCode and get his data as json', () => {
      const insiPerson = new INSiPerson({
        formerName: 'Dampierre',
        firstName: 'Eric',
        gender: Gender.Male,
        birthDate: '1990-01-01',
      });

      expect(insiPerson.getSoapDataAsJson()).toEqual({
        NomNaissance: 'Dampierre',
        Prenom: 'Eric',
        Sexe: Gender.Male,
        DateNaissance: '1990-01-01',
      });
    });

    test('should not be able to create an INSi Person if empty formerName', () => {
      expect(() => {
        new INSiPerson({
          formerName: '',
          firstName: 'Eric',
          gender: Gender.Male,
          birthDate: '1990-01-01',
          birthPlaceCode: '20020',
        });
      }).toThrow('Fail to create an INSiPerson, you must provide a formerName');
    });

    test('should not be able to create an INSi Person if empty firstName', () => {
      expect(() => {
        new INSiPerson({
          formerName: 'Dampierre',
          firstName: '',
          gender: Gender.Male,
          birthDate: '1990-01-01',
          birthPlaceCode: '20020',
        });
      }).toThrow('Fail to create an INSiPerson, you must provide a firstName');
    });

    test('should not be able to create an INSi Person if empty birthDate', () => {
      expect(() => {
        new INSiPerson({
          formerName: 'Dampierre',
          firstName: 'Eric',
          gender: Gender.Male,
          birthDate: '',
          birthPlaceCode: '20020',
        });
      }).toThrow('Fail to create an INSiPerson, you must provide a valid birthDate');
    });

    test('should not be able to create an INSi Person if birthDate is not valid', () => {
      expect(() => {
        new INSiPerson({
          formerName: 'Dampierre',
          firstName: 'Eric',
          gender: Gender.Male,
          birthDate: '2021-56-12',
          birthPlaceCode: '20020',
        });
      }).toThrow('Fail to create an INSiPerson, you must provide a valid birthDate');
    });
  });

  describe('INSi Client', () => {
    test('should be able to create a new INSi client without throwing', () => {
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

      insiClient = new INSiClient({
        lpsContext,
        bamContext,
      });
    });

    test('should throw an error if calling fetchInsi without initClient first', async () => {
      const person = new INSiPerson({
        formerName: 'ADRTROIS',
        firstName: 'DOMINIQUE',
        gender: Gender.Female,
        birthDate: '1997-02-26',
      });
      await expect(async () => insiClient.fetchIdentity(person))
        .rejects.toThrow('fetchIdentity ERROR: you must init client first');
    });

    test('should be able to initClient without throwing error', async () => {
      await insiClient.initClient(pfx, PASSPHRASE);
    });

    test('should be able to call fetchIdentity', async () => {
      const person = new INSiPerson({
        formerName: 'ADRTROIS',
        firstName: 'DOMINIQUE',
        gender: Gender.Female,
        birthDate: '1997-02-26',
      });

      const { requestId, responseAsJson, responseAsXMl, requestAsXML } = await insiClient.fetchIdentity(person, {
        requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
      });

      expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
      expect(responseAsJson).toEqual(getAdrtroisDominiqueJsonResponse());
      expect(responseAsXMl).toEqual(getAdrtroisDominiqueXmlResponse());
      expect(requestAsXML).toEqual(getAdrtroisDominiqueXmlResquest({
        idam: IDAM,
        version: SOFTWARE_VERSION,
        name: SOFTWARE_NAME,
      }));
    });

    test('should throw an INSi error if the software is not allowed', async () => {
      const lps = new LPS({
        idam: 'FAKE-IDAM',
        version: SOFTWARE_VERSION,
        name: SOFTWARE_NAME,
      });
      const lpsContext = new LpsContext({ emitter: 'medecin@yopmail.com', lps });
      const bamContext = new BamContext({ emitter: 'medecin@yopmail.com' });
      insiClient = new INSiClient({ lpsContext, bamContext, });
      await insiClient.initClient(pfx, PASSPHRASE);
      const person = new INSiPerson({
        formerName: 'ADRTROIS',
        firstName: 'DOMINIQUE',
        gender: Gender.Female,
        birthDate: '1997-02-26',
      });

      await expect(async () => insiClient.fetchIdentity(person)).rejects.toThrow();
    });
  });
});
