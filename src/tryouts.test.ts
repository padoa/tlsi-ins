import fs from 'fs';
import { validate as validateUUID } from 'uuid';
import { combineCACertAsPem, readCACertAsPem } from './utils/certificates';
import { IDAM, PASSPHRASE, SOFTWARE_NAME, SOFTWARE_VERSION } from './models/env';
import { INSiClient } from './insi-client.service';
import { LPS } from './class/lps.class';
import { LpsContext } from './class/lps-context.class';
import { BamContext } from './class/bam-context.class';
import { Gender, INSiPerson } from './class/insi-person.class';

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

      expect(lpsContext.getSoapHeaderAsJson()).toEqual({
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

      expect(bamContext.getSoapHeaderAsJson()).toEqual({
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
        lastName: 'Dampierre',
        firstName: 'Eric',
        gender: Gender.Male,
        dateOfBirth: '1990-01-01',
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
        lastName: 'Dampierre',
        firstName: 'Eric',
        gender: Gender.Male,
        dateOfBirth: '1990-01-01',
      });

      expect(insiPerson.getSoapDataAsJson()).toEqual({
        NomNaissance: 'Dampierre',
        Prenom: 'Eric',
        Sexe: Gender.Male,
        DateNaissance: '1990-01-01',
      });
    });

    test('should not be able to create an INSi Person if empty lastName', () => {
      expect(() => {
        new INSiPerson({
          lastName: '',
          firstName: 'Eric',
          gender: Gender.Male,
          dateOfBirth: '1990-01-01',
          birthPlaceCode: '20020',
        });
      }).toThrow('Fail to create an INSiPerson, you must provide a lastName');
    });

    test('should not be able to create an INSi Person if empty firstName', () => {
      expect(() => {
        new INSiPerson({
          lastName: 'Dampierre',
          firstName: '',
          gender: Gender.Male,
          dateOfBirth: '1990-01-01',
          birthPlaceCode: '20020',
        });
      }).toThrow('Fail to create an INSiPerson, you must provide a firstName');
    });

    test('should not be able to create an INSi Person if empty dateOfBirth', () => {
      expect(() => {
        new INSiPerson({
          lastName: 'Dampierre',
          firstName: 'Eric',
          gender: Gender.Male,
          dateOfBirth: '',
          birthPlaceCode: '20020',
        });
      }).toThrow('Fail to create an INSiPerson, you must provide a valid dateOfBirth');
    });

    test('should not be able to create an INSi Person if dateOfBirth is not valid', () => {
      expect(() => {
        new INSiPerson({
          lastName: 'Dampierre',
          firstName: 'Eric',
          gender: Gender.Male,
          dateOfBirth: '2021-56-12',
          birthPlaceCode: '20020',
        });
      }).toThrow('Fail to create an INSiPerson, you must provide a valid dateOfBirth');
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

    test('should be able to initClient without throwing error', async () => {
      await insiClient.initClient(pfx, PASSPHRASE);
    })

    test('should be able to call fetchIdentity', async () => {
      const person = new INSiPerson({
        lastName: 'ADRTROIS',
        firstName: 'DOMINIQUE',
        gender: Gender.Female,
        dateOfBirth: '1997-02-26',
      });

      const { requestId, responseAsJson, responseAsXMl, requestAsXML } = await insiClient.fetchIdentity(person, {
        requestId: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f'
      });

      expect(requestId).toEqual('b3549edd-4ae9-472a-b26f-fd2fb4ef397f');
      expect(responseAsJson).toEqual({
        CR: {
          CodeCR: '00',
          LibelleCR: 'OK'
        },
        INDIVIDU: {
          INSACTIF: {
            IdIndividu: {
              NumIdentifiant: '297022A020778',
              Cle: '78'
            },
            OID: '1.2.250.1.213.1.4.8'
          },
          TIQ: {
            NomNaissance: 'ADRTROIS',
            Prenom: 'DOMINIQUE',
            ListePrenom: 'DOMINIQUE',
            Sexe: 'F',
            DateNaissance: '1997-02-26',
            LieuNaissance: '20020'
          }
        }
      });
      expect(responseAsXMl).toEqual([
        '<?xml version="1.0" encoding="UTF-8"?>\n',
        '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">',
        '<env:Body xmlns:S="http://www.w3.org/2003/05/soap-envelope" xmlns:env="http://www.w3.org/2003/05/soap-envelope">',
        '<ns2:RESULTAT xmlns:ns3="http://www.cnamts.fr/INSiRecVit" xmlns:ns2="http://www.cnamts.fr/INSiResultat" xmlns="http://www.cnamts.fr/INSiRecSans">',
        '<ns2:CR>',
        '<ns2:CodeCR>00</ns2:CodeCR>',
        '<ns2:LibelleCR>OK</ns2:LibelleCR>',
        '</ns2:CR>',
        '<ns2:INDIVIDU>',
        '<ns2:INSACTIF>',
        '<ns2:IdIndividu>',
        '<ns2:NumIdentifiant>297022A020778</ns2:NumIdentifiant>',
        '<ns2:Cle>78</ns2:Cle>',
        '</ns2:IdIndividu>',
        '<ns2:OID>1.2.250.1.213.1.4.8</ns2:OID>',
        '</ns2:INSACTIF>',
        '<ns2:TIQ>',
        '<ns2:NomNaissance>ADRTROIS</ns2:NomNaissance>',
        '<ns2:Prenom>DOMINIQUE</ns2:Prenom>',
        '<ns2:ListePrenom>DOMINIQUE</ns2:ListePrenom>',
        '<ns2:Sexe>F</ns2:Sexe>',
        '<ns2:DateNaissance>1997-02-26</ns2:DateNaissance>',
        '<ns2:LieuNaissance>20020</ns2:LieuNaissance>',
        '</ns2:TIQ>',
        '</ns2:INDIVIDU>',
        '</ns2:RESULTAT>',
        '</env:Body>',
        '</soap:Envelope>',
      ].join(''));
      expect(requestAsXML).toEqual([
        '<?xml version="1.0" encoding="utf-8"?>',
        '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  xmlns:tns="http://www.cnamts.fr/webservice" xmlns:insi="http://www.cnamts.fr/ServiceIdentiteCertifiee/v1" xmlns:insi_recsans_ins="http://www.cnamts.fr/INSiRecSans" xmlns:insi_recvit_ins="http://www.cnamts.fr/INSiRecVit" xmlns:insi_resultat_ins="http://www.cnamts.fr/INSiResultat" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:ctxbam="urn:siram:bam:ctxbam" xmlns:ctxlps="urn:siram:lps:ctxlps" xmlns:siram="urn:siram" xmlns:jaxb="http://java.sun.com/xml/ns/jaxb" xmlns:xjc="http://java.sun.com/xml/ns/jaxb/xjc">',
        '<soap:Header>',
        '<ctxbam:ContexteBAM Version="01_02">',
        '<ctxbam:Id>c1a2ff23-fc05-4bd1-b500-1ec7d3178f1c</ctxbam:Id>',
        '<ctxbam:Temps>2021-07-05T13:58:27.452Z</ctxbam:Temps>',
        '<ctxbam:Emetteur>medecin@yopmail.com</ctxbam:Emetteur>',
        '<ctxbam:COUVERTURE>',
        '</ctxbam:COUVERTURE>',
        '</ctxbam:ContexteBAM> <ctxlps:ContexteLPS Nature="CTXLPS" Version="01_00">',
        '<ctxlps:Id>1f7425e2-b913-415c-adaa-785ee1076a70</ctxlps:Id>',
        '<ctxlps:Temps>2021-07-05T13:58:27.452Z</ctxlps:Temps>',
        '<ctxlps:Emetteur>medecin@yopmail.com</ctxlps:Emetteur>',
        '<ctxlps:LPS>',
        `<ctxlps:IDAM R="4">${IDAM}</ctxlps:IDAM>`,
        `<ctxlps:Version>${SOFTWARE_VERSION}</ctxlps:Version>`,
        '<ctxlps:Instance>b3549edd-4ae9-472a-b26f-fd2fb4ef397f</ctxlps:Instance>',
        `<ctxlps:Nom>${SOFTWARE_NAME}</ctxlps:Nom>`,
        '</ctxlps:LPS>',
        '</ctxlps:ContexteLPS> <wsa:Action xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns="http://www.w3.org/2005/08/addressing">urn:ServiceIdentiteCertifiee:1.0.0:rechercherInsAvecTraitsIdentite</wsa:Action> <wsa:MessageID xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns="http://www.w3.org/2005/08/addressing">b3549edd-4ae9-472a-b26f-fd2fb4ef397f</wsa:MessageID>',
        '</soap:Header>',
        '<soap:Body>',
        '<insi_recsans_ins:RECSANSVITALE xmlns:insi_recsans_ins="http://www.cnamts.fr/INSiRecSans" xmlns="http://www.cnamts.fr/INSiRecSans">',
        '<insi_recsans_ins:NomNaissance>ADRTROIS</insi_recsans_ins:NomNaissance>',
        '<insi_recsans_ins:Prenom>DOMINIQUE</insi_recsans_ins:Prenom>',
        '<insi_recsans_ins:Sexe>F</insi_recsans_ins:Sexe>',
        '<insi_recsans_ins:DateNaissance>1997-02-26</insi_recsans_ins:DateNaissance>',
        '</insi_recsans_ins:RECSANSVITALE>',
        '</soap:Body>',
        '</soap:Envelope>',
      ].join(''));
    });
  });
});
