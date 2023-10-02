import { LPS } from './class/lps.class';
import { IDAM, SOFTWARE_NAME, SOFTWARE_VERSION } from './models/env';
import { LpsContext, LpsContextSoapHeader } from './class/lps-context.class';
import { BamContext, BamContextSoapHeader } from './class/bam-context.class';
import { INSiClient } from './insi-client.service';
import { Gender, INSiPerson } from './class/insi-person.class';
import {
  defaultUuid,
  defaultDate,
} from './fixtures/insi-client.fixture';
import { getXmlRequestTest} from './test/xml-request-tester';

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

beforeEach(() => {
  jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2023-01-01T00:00:00.000Z');
  jest.spyOn(INSiClient.prototype, 'getLpsContextEmitter').mockReturnValue('medecin@yopmail.com');
 
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
          },
        };
        const name = 'ContexteLPS';
        const namespace = 'ctxlps';
        return { soapHeader, name, namespace };
      },
    })),
  }));
});

afterEach(() => {
    jest.restoreAllMocks()
});

describe('INSi Client', () => {
  let insiClient: INSiClient;

  describe('Initialisation', () => {
    test('should be able to create a new INSi client without throwing', () => {
      insiClient = getClientWithDefinedId();
    });

    test('should get correct response for ADRUN ZOE', async () => {
      const requestId = '7871dedb-2add-47db-8b76-117f8144a840';
      const person = new INSiPerson({
        birthName: 'ADRUN',
        firstName: 'ZOE',
        gender: Gender.Female,
        dateOfBirth: '1975-12-31',
      });

      const fetchInsResult = await insiClient.fetchIns(person, { requestId, virtualModeEnabled: true });
      expect(fetchInsResult).toEqual({
        successRequest: {
          "status": "SUCCESS",
          "request": {
            "id": expect.any(String),
            "xml": getXmlRequestTest({idam: IDAM, version: SOFTWARE_VERSION, name: SOFTWARE_NAME, person: person.getPerson(), requestId})
          },
          "response": {
            "formatted": {
              "birthName": "ADRUN",
              "firstName": "ZOE",
              "allFirstNames": "ZOE",
              "gender": "F",
              "dateOfBirth": "1975-12-31",
              "placeOfBirthCode": "63220",
              "registrationNumber": "275126322074974",
              "oid": "1.2.250.1.213.1.4.8"
            },
            "json": {
              "CR": {
                "CodeCR": "00",
                "LibelleCR": "OK"
              },
              "INDIVIDU": {
                "INSACTIF": {
                  "IdIndividu": {
                    "NumIdentifiant": "275126322074974",
                    "Cle": "74"
                  },
                  "OID": "1.2.250.1.213.1.4.8"
                },
                "TIQ": {
                  "NomNaissance": "ADRUN",
                  "ListePrenom": "ZOE",
                  "Sexe": "F",
                  "DateNaissance": "1975-12-31",
                  "LieuNaissance": "63220"
                }
              }
            },
            "xml": expect.any(String),
            "error": null
          }
        },
        failedRequests: [],
      });
    });

    test('should get correct response for Tchitchi ola', async () => {
      const requestId = 'b3d188ab-8bc5-4e75-b217-a0ecf58a6953';
      const person = new INSiPerson({
        birthName: 'TCHITCHI',
        firstName: 'OLA CATARINA BELLA',
        gender: Gender.Female,
        dateOfBirth: '1936-06-21',
      });

      const fetchInsResult = await insiClient.fetchIns(person, { requestId, virtualModeEnabled: true });
      expect(fetchInsResult).toEqual({
        successRequest: {
          "status": "SUCCESS",
          "request": {
              "id": expect.any(String),
              "xml": getXmlRequestTest({idam: IDAM, version: SOFTWARE_VERSION, name: SOFTWARE_NAME, person: {firstName: 'CATARINA', birthName: 'TCHITCHI', dateOfBirth: '1936-06-21', gender: Gender.Female}, requestId})
          },
          "response": {
              "formatted": {
                  "birthName": "TCHITCHI",
                  "firstName": "CATARINA",
                  "allFirstNames": "CATARINA BELLA",
                  "gender": "F",
                  "dateOfBirth": "1936-06-21",
                  "placeOfBirthCode": "63220",
                  "registrationNumber": "236066322083656",
                  "oid": "1.2.250.1.213.1.4.8"
              },
              "json": {
                  "CR": {
                      "CodeCR": "00",
                      "LibelleCR": "OK"
                  },
                  "INDIVIDU": {
                      "INSACTIF": {
                          "IdIndividu": {
                              "NumIdentifiant": "2360663220836",
                              "Cle": "56"
                          },
                          "OID": "1.2.250.1.213.1.4.8"
                      },
                      "TIQ": {
                          "NomNaissance": "TCHITCHI",
                          "ListePrenom": "CATARINA BELLA",
                          "Sexe": "F",
                          "DateNaissance": "1936-06-21",
                          "LieuNaissance": "63220"
                      }
                  }
              },
              "xml": expect.any(String),
              "error": null
          }
      },
        failedRequests: [{
          "status": "SUCCESS",
          "request": {
            "id": expect.any(String),
            "xml": getXmlRequestTest({idam: IDAM, version: SOFTWARE_VERSION, name: SOFTWARE_NAME, person: {firstName: 'OLA', birthName: 'TCHITCHI', dateOfBirth: '1936-06-21', gender: Gender.Female}, requestId})
          },
          "response": {
            "formatted": null,
            "json": {
                "CR": {
                    "CodeCR": "01",
                    "LibelleCR": "Aucune identite trouvee"
                }
            },
            "xml": expect.any(String),
            "error": null
          }
        }],
      });
    });

    test('should get correct response for CORSE Anthony', async () => {
      const requestId = 'b3d188ab-8bc5-4e75-b217-a0ecf58a6953';
      const person = new INSiPerson({
        birthName: 'CORSE',
        firstName: 'ANTHONY',
        gender: Gender.Male,
        dateOfBirth: '1980-03-02',
      });

      const fetchInsResult = await insiClient.fetchIns(person, { requestId, virtualModeEnabled: true });
      expect(fetchInsResult).toEqual({
        successRequest: {
          "status": "SUCCESS",
          "request": {
            "id": expect.any(String),
            "xml": getXmlRequestTest({
              idam: IDAM,
              version: SOFTWARE_VERSION,
              name: SOFTWARE_NAME,
              person: {firstName: 'ANTHONY', birthName: 'CORSE', dateOfBirth: '1980-03-02', gender: Gender.Male}, requestId
            })
          },
          "response": {
            "formatted": {
              "birthName": "CORSE",
              "firstName": "ANTHONY",
              "allFirstNames": "ANTHONY",
              "gender": "M",
              "dateOfBirth": "1980-03-02",
              "placeOfBirthCode": "2B020",
              "registrationNumber": "180032B02040123",
              "oid": "1.2.250.1.213.1.4.8"
            },
            "json": {
              "CR": {
                "CodeCR": "00",
                "LibelleCR": "OK"
              },
              "INDIVIDU": {
                "INSACTIF": {
                  "IdIndividu": {
                    "NumIdentifiant": "180032B020401",
                    "Cle": "23"
                  },
                  "OID": "1.2.250.1.213.1.4.8"
                },
                "INSHISTO": [
                  {
                    "IdIndividu": {
                      "NumIdentifiant": "180032B020401",
                      "Cle": "23"
                    },
                    "OID": "1.2.250.1.213.1.4.8"
                  }
                ],
                "TIQ": {
                  "NomNaissance": "CORSE",
                  "Prenom": "ANTHONY",
                  "ListePrenom": "ANTHONY",
                  "Sexe": "M",
                  "DateNaissance": "1980-03-02",
                  "LieuNaissance": "2B020"
                }
              }
            },
            "xml": expect.any(String),
            "error": null
          }
        },
        failedRequests: [],
      });
    });

    test('should get correct response for DE VINCI Ruth', async () => {
      const requestId = 'b3d188ab-8bc5-4e75-b217-a0ecf58a6953';
      const person = new INSiPerson({
        birthName: 'DE VINCI',
        firstName: 'RUTH',
        gender: Gender.Female,
        dateOfBirth: '1976-07-14',
      });

      const fetchInsResult = await insiClient.fetchIns(person, { requestId, virtualModeEnabled: true });
      expect(fetchInsResult).toEqual({
        successRequest: null,
        failedRequests: [{
          "status": "FAIL",
          "request": {
            "id": expect.any(String),
            "xml": getXmlRequestTest({idam: IDAM, version: SOFTWARE_VERSION, name: SOFTWARE_NAME, person: person.getPerson(), requestId})
          },
          "response": {
            "formatted": null,
            "json": null,
            "xml": expect.any(String),
            "error": {
              siramCode: "siram_40",
              text: "Le service est temporairement inaccessible. Veuillez renouveler votre demande ultérieurement. Si le problème persiste, contactez l'éditeur du progiciel ou votre responsable informatique.",
              desirCode: "insi_102",
              error: "L'appel au service de recherche avec les traits d'identité renvoie une erreur technique."
            }
          }
        }],
      });
    });

    test('should get correct response for Houilles Pierre', async () => {
      const requestId = 'b3d188ab-8bc5-4e75-b217-a0ecf58a6953';
      const person = new INSiPerson({
        birthName: 'HOUILLES',
        firstName: 'PIERRE',
        gender: Gender.Male,
        dateOfBirth: '1993-01-27',
      });

      const fetchInsResult = await insiClient.fetchIns(person, { requestId, virtualModeEnabled: true });
      expect(fetchInsResult).toEqual({
        successRequest: null,
        failedRequests: [{
          "status": "SUCCESS",
          "request": {
            "id": expect.any(String),
            "xml": getXmlRequestTest({idam: IDAM, version: SOFTWARE_VERSION, name: SOFTWARE_NAME, person: {firstName: 'PIERRE', birthName: 'HOUILLES', dateOfBirth: '1993-01-27', gender: Gender.Male}, requestId})
          },
          "response": {
            formatted: null,
            json: {
              CR: {
                    CodeCR: "01",
                    LibelleCR: "Aucune identite trouvee"
                }
            },
            "xml": expect.any(String),
            "error": null
          }
        }, {
          "status": "SUCCESS",
          "request": {
            "id": expect.any(String),
            "xml": getXmlRequestTest({idam: IDAM, version: SOFTWARE_VERSION, name: SOFTWARE_NAME, person: {firstName: 'PAUL', birthName: 'HOUILLES', dateOfBirth: '1993-01-27', gender: Gender.Male}, requestId})
          },
          "response": {
            formatted: null,
            json: {
              CR: {
                    CodeCR: "01",
                    LibelleCR: "Aucune identite trouvee"
                }
            },
            "xml": expect.any(String),
            "error": null
          }
        }, {
          "status": "SUCCESS",
          "request": {
            "id": expect.any(String),
            "xml": getXmlRequestTest({idam: IDAM, version: SOFTWARE_VERSION, name: SOFTWARE_NAME, person: {firstName: 'JACQUES', birthName: 'HOUILLES', dateOfBirth: '1993-01-27', gender: Gender.Male}, requestId})
          },
          "response": {
            formatted: null,
            json: {
              CR: {
                    CodeCR: "01",
                    LibelleCR: "Aucune identite trouvee"
                }
            },
            "xml": expect.any(String),
            "error": null
          }
        }, {
          "status": "SUCCESS",
          "request": {
            "id": expect.any(String),
            "xml": getXmlRequestTest({idam: IDAM, version: SOFTWARE_VERSION, name: SOFTWARE_NAME, person: {firstName: 'PIERRE PAUL JACQUES', birthName: 'HOUILLES', dateOfBirth: '1993-01-27', gender: Gender.Male}, requestId})
          },
          "response": {
            formatted: null,
            json: {
              CR: {
                    CodeCR: "01",
                    LibelleCR: "Aucune identite trouvee"
                }
            },
            "xml": expect.any(String),
            "error": null
          }
        }],
      });
    });

  });
});
