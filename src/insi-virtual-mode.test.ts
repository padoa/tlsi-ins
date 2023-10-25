import { LPS } from './class/lps.class';
import { LpsContext } from './class/lps-context.class';
import { BamContext } from './class/bam-context.class';
import { INSiClient } from './insi-client.service';
import { Gender, INSiPerson } from './class/insi-person.class';
import { getNoIdentityXmlResponseTest, getValidXmlResponseTest, getXmlRequestTest } from './test/xml-request-tester';
import { INSiServiceFormattedResponse } from './models/insi-fetch-ins.models';

const clientConfig = {
  idam: 'idam',
  version: 'version',
  name: 'name',
  emitter: 'medecin@yopmail.com',
}

const nowDate = '2023-01-01T00:00:00.000Z';

const getClientWithDefinedId = (overrideSpecialCases = true): INSiClient => {
  const lps = new LPS({
    idam: clientConfig.idam,
    version: clientConfig.version,
    name: clientConfig.name,
    id: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
  });

  const lpsContext = new LpsContext({
    emitter: clientConfig.emitter,
    lps,
  });

  const bamContext = new BamContext({
    emitter: clientConfig.emitter,
  });

  return new INSiClient({
    lpsContext,
    bamContext,
    overrideSpecialCases,
  });
};


describe('INSi Client', () => {
  let insiClient: INSiClient;

  beforeEach(() => {
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(nowDate);
  });

  afterEach(() => {
    jest.restoreAllMocks()
  });

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
      const personDetails: INSiServiceFormattedResponse = {
        ...person.getPerson(),
        registrationNumber: '275126322074974',
        oid: '1.2.250.1.213.1.4.8',
        placeOfBirthCode: '63220',
        allFirstNames: 'ZOE'
      };

      const fetchInsResult = await insiClient.fetchIns(person, { requestId, virtualModeEnabled: true });
      expect(fetchInsResult).toEqual({
        successRequest: {
          "status": "SUCCESS",
          "request": {
            "id": expect.any(String),
            "xml": getXmlRequestTest({ ...clientConfig, person: person.getPerson(), requestId, date: nowDate })
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
                    "NumIdentifiant": "2751263220749",
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
            "xml": getValidXmlResponseTest(personDetails),
            "error": null
          }
        },
        failedRequests: [],
      });
    });

    test('should get correct response for Ecetinsi Pierre-Alain', async () => {
      const requestId = '7871dedb-2add-47db-8b76-117f8144a840';
      const person = new INSiPerson({
        birthName: 'ECETINSI',
        firstName: 'PIERRE-ALAIN',
        gender: Gender.Male,
        dateOfBirth: '2009-07-14',
      });
      const personDetails: INSiServiceFormattedResponse = {
        ...person.getPerson(),
        registrationNumber: '109076322083489',
        oid: '1.2.250.1.213.1.4.8',
        placeOfBirthCode: '63220',
        allFirstNames: 'PIERRE-ALAIN MURIEL FLORIANT'
      };
      const insHisto = [
        {
          "IdIndividu": {
            "NumIdentifiant": "2090763220834",
            "Cle": "39",
            "TypeMatricule": "NIR"
          },
          "OID": "1.2.250.1.213.1.4.8"
        },
        {
          "IdIndividu": {
            "NumIdentifiant": "2090663220123",
            "Cle": "55",
            "TypeMatricule": "NIR"
          },
          "OID": "1.2.250.1.213.1.4.8"
        }
      ];
      const fetchInsResult = await insiClient.fetchIns(person, { requestId, virtualModeEnabled: true });
      expect(fetchInsResult).toEqual({
        successRequest: {
          "status": "SUCCESS",
          "request": {
            "id": expect.any(String),
            "xml": getXmlRequestTest({ ...clientConfig, person: person.getPerson(), requestId, date: nowDate })
          },
          "response": {
            "formatted": {
              "birthName": "ECETINSI",
              "firstName": "PIERRE-ALAIN",
              "allFirstNames": "PIERRE-ALAIN MURIEL FLORIANT",
              "gender": "M",
              "dateOfBirth": "2009-07-14",
              "placeOfBirthCode": "63220",
              "registrationNumber": "109076322083489",
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
                    "NumIdentifiant": "1090763220834",
                    "Cle": "89"
                  },
                  "OID": "1.2.250.1.213.1.4.8"
                },
                "INSHISTO": insHisto,
                "TIQ": {
                  "NomNaissance": "ECETINSI",
                  "ListePrenom": "PIERRE-ALAIN MURIEL FLORIANT",
                  "Sexe": "M",
                  "DateNaissance": "2009-07-14",
                  "LieuNaissance": "63220"
                }
              }
            },
            "xml": getValidXmlResponseTest(personDetails, insHisto),
            "error": null
          },
        },
        failedRequests: [],
      });
    });

    test('should get correct response for Herman Gatien', async () => {
      const requestId = '7871dedb-2add-47db-8b76-117f8144a840';
      const person = new INSiPerson({
        birthName: 'HERMANN',
        firstName: 'GATIEN',
        gender: Gender.Male,
        dateOfBirth: '1981-03-24',
      });
      const personDetails: INSiServiceFormattedResponse = {
        ...person.getPerson(),
        registrationNumber: '181036322045660',
        oid: '1.2.250.1.213.1.4.8',
        placeOfBirthCode: '63220',
        allFirstNames: 'GATIEN'
      };
      const insHisto = [
        {
          "IdIndividu": {
            "NumIdentifiant": "1810363220456",
            "Cle": "60"
          },
          "OID": "1.2.250.1.213.1.4.8"
        },
        {
          "IdIndividu": {
            "NumIdentifiant": "2810363220456",
            "Cle": "10"
          },
          "OID": "1.2.250.1.213.1.4.8"
        }
      ]

      const fetchInsResult = await insiClient.fetchIns(person, { requestId, virtualModeEnabled: true });
      expect(fetchInsResult).toEqual({
        successRequest: {
          "status": "SUCCESS",
          "request": {
            "id": expect.any(String),
            "xml": getXmlRequestTest({ ...clientConfig, person: person.getPerson(), requestId, date: nowDate })
          },
          "response": {
            "formatted": {
              "birthName": "HERMANN",
              "firstName": "GATIEN",
              "allFirstNames": "GATIEN",
              "gender": "M",
              "dateOfBirth": "1981-03-24",
              "placeOfBirthCode": "63220",
              "registrationNumber": "181036322045660",
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
                    "NumIdentifiant": "1810363220456",
                    "Cle": "60"
                  },
                  "OID": "1.2.250.1.213.1.4.8"
                },
                "INSHISTO": insHisto,
                "TIQ": {
                  "NomNaissance": "HERMANN",
                  "ListePrenom": "GATIEN",
                  "Sexe": "M",
                  "DateNaissance": "1981-03-24",
                  "LieuNaissance": "63220"
                }
              }
            },
            "xml": getValidXmlResponseTest(personDetails, insHisto),
            "error": null
          },
        },
        failedRequests: [],
      });
    });

    test('should get correct response for NESSI Michelangelo', async () => {
      const requestId = '7871dedb-2add-47db-8b76-117f8144a840';
      const person = new INSiPerson({
        birthName: 'NESSI',
        firstName: 'MICHELANGELO',
        gender: Gender.Male,
        dateOfBirth: '2010-08-07',
      });
      const personDetails: INSiServiceFormattedResponse = {
        ...person.getPerson(),
        registrationNumber: '110086322083060',
        oid: '1.2.250.1.213.1.4.8',
        placeOfBirthCode: '63220',
        allFirstNames: 'MICHELANGELO ANTHONY'
      };

      const fetchInsResult = await insiClient.fetchIns(person, { requestId, virtualModeEnabled: true });
      expect(fetchInsResult).toEqual({
        successRequest: {
          "status": "SUCCESS",
          "request": {
            "id": expect.any(String),
            "xml": getXmlRequestTest({ ...clientConfig, person: person.getPerson(), requestId, date: nowDate })
          },
          "response": {
            "formatted": {
              "birthName": "NESSI",
              "firstName": "MICHELANGELO",
              "allFirstNames": "MICHELANGELO ANTHONY",
              "gender": "M",
              "dateOfBirth": "2010-08-07",
              "placeOfBirthCode": "63220",
              "registrationNumber": "110086322083060",
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
                          "NumIdentifiant": "1100863220830",
                          "Cle": "60"
                      },
                      "OID": "1.2.250.1.213.1.4.8"
                  },
                  "TIQ": {
                      "NomNaissance": "NESSI",
                      "ListePrenom": "MICHELANGELO ANTHONY",
                      "Sexe": "M",
                      "DateNaissance": "2010-08-07",
                      "LieuNaissance": "63220"
                  }
              }
          },
            "xml": getValidXmlResponseTest(personDetails),
            "error": null
          },
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
      const personDetails: INSiServiceFormattedResponse = {
        ...person.getPerson(),
        registrationNumber: '236066322083656',
        oid: '1.2.250.1.213.1.4.8',
        placeOfBirthCode: '63220',
        allFirstNames: 'CATARINA BELLA'
      };

      const fetchInsResult = await insiClient.fetchIns(person, { requestId, virtualModeEnabled: true });
      expect(fetchInsResult).toEqual({
        successRequest: {
          "status": "SUCCESS",
          "request": {
            "id": expect.any(String),
            "xml": getXmlRequestTest({ ...clientConfig, person: { firstName: 'CATARINA', birthName: 'TCHITCHI', dateOfBirth: '1936-06-21', gender: Gender.Female }, requestId, date: nowDate })
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
            "xml": getValidXmlResponseTest(personDetails),
            "error": null
          }
        },
        failedRequests: [{
          "status": "SUCCESS",
          "request": {
            "id": expect.any(String),
            "xml": getXmlRequestTest({ ...clientConfig, person: { firstName: 'OLA', birthName: 'TCHITCHI', dateOfBirth: '1936-06-21', gender: Gender.Female }, requestId, date: nowDate })
          },
          "response": {
            "formatted": null,
            "json": {
              "CR": {
                "CodeCR": "01",
                "LibelleCR": "Aucune identite trouvee"
              }
            },
            "xml": getNoIdentityXmlResponseTest(),
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
      const personDetails: INSiServiceFormattedResponse = {
        ...person.getPerson(),
        registrationNumber: '180032B02040123',
        oid: '1.2.250.1.213.1.4.8',
        placeOfBirthCode: '2B020',
        allFirstNames: 'ANTHONY'
      };
      const insHisto = [
        {
          "IdIndividu": {
            "NumIdentifiant": "180032B020401",
            "Cle": "23"
          },
          "OID": "1.2.250.1.213.1.4.8"
        }
      ]

      const fetchInsResult = await insiClient.fetchIns(person, { requestId, virtualModeEnabled: true });
      expect(fetchInsResult).toEqual({
        successRequest: {
          "status": "SUCCESS",
          "request": {
            "id": expect.any(String),
            "xml": getXmlRequestTest({
              ...clientConfig,
              person: { firstName: 'ANTHONY', birthName: 'CORSE', dateOfBirth: '1980-03-02', gender: Gender.Male },
              requestId,
              date: nowDate,
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
                  "ListePrenom": "ANTHONY",
                  "Sexe": "M",
                  "DateNaissance": "1980-03-02",
                  "LieuNaissance": "2B020"
                }
              }
            },
            "xml": getValidXmlResponseTest(personDetails, insHisto),
            "error": null
          }
        },
        failedRequests: [],
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
            "xml": getXmlRequestTest({ ...clientConfig, person: { firstName: 'PIERRE', birthName: 'HOUILLES', dateOfBirth: '1993-01-27', gender: Gender.Male }, requestId, date: nowDate })
          },
          "response": {
            formatted: null,
            json: {
              CR: {
                CodeCR: "01",
                LibelleCR: "Aucune identite trouvee"
              }
            },
            "xml": getNoIdentityXmlResponseTest(),
            "error": null
          }
        }, {
          "status": "SUCCESS",
          "request": {
            "id": expect.any(String),
            "xml": getXmlRequestTest({ ...clientConfig, person: { firstName: 'PAUL', birthName: 'HOUILLES', dateOfBirth: '1993-01-27', gender: Gender.Male }, requestId, date: nowDate })
          },
          "response": {
            formatted: null,
            json: {
              CR: {
                CodeCR: "01",
                LibelleCR: "Aucune identite trouvee"
              }
            },
            "xml": getNoIdentityXmlResponseTest(),
            "error": null
          }
        }, {
          "status": "SUCCESS",
          "request": {
            "id": expect.any(String),
            "xml": getXmlRequestTest({ ...clientConfig, person: { firstName: 'JACQUES', birthName: 'HOUILLES', dateOfBirth: '1993-01-27', gender: Gender.Male }, requestId, date: nowDate })
          },
          "response": {
            formatted: null,
            json: {
              CR: {
                CodeCR: "01",
                LibelleCR: "Aucune identite trouvee"
              }
            },
            "xml": getNoIdentityXmlResponseTest(),
            "error": null
          }
        }, {
          "status": "SUCCESS",
          "request": {
            "id": expect.any(String),
            "xml": getXmlRequestTest({ ...clientConfig, person: { firstName: 'PIERRE PAUL JACQUES', birthName: 'HOUILLES', dateOfBirth: '1993-01-27', gender: Gender.Male }, requestId, date: nowDate })
          },
          "response": {
            formatted: null,
            json: {
              CR: {
                CodeCR: "01",
                LibelleCR: "Aucune identite trouvee"
              }
            },
            "xml": getNoIdentityXmlResponseTest(),
            "error": null
          }
        }],
      });
    });

  });
});
