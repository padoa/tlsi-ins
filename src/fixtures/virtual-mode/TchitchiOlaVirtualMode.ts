import { Gender, INSiPersonArgs } from "../../class/insi-person.class";
import { getCNDAValidationXmlRequest } from "../insi-client.fixture";
import BasicVirtualMode from "./BasicVirtualMode";
import { CRCodes, CRLabels, INSiServiceFetchInsRequest, INSiServiceFormattedResponse, INSiServiceJsonResponse, INSiServiceRequestStatus } from '../../models/insi-fetch-ins.models';
import { v4 as uuidv4 } from 'uuid';

export class TchitchiOlaVirtualMode extends BasicVirtualMode {
    getXmlRequest(person: INSiPersonArgs, firstNameResquest: string, requestDate: string, requestId: string, { idam, version, name, assertionPs }: { idam: string, version: string, name: string, assertionPs?: string }): any {
        return getCNDAValidationXmlRequest({
            idam,
            version,
            name,
            requestDate,
            requestId,
            birthName: person.birthName,
            firstName: firstNameResquest,
            gender: person.gender,
            dateOfBirth: person.dateOfBirth,
            assertionPs,
        });
    }
    getValidXmlResponse(): string {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\"><env:Body xmlns:S=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:env=\"http://www.w3.org/2003/05/soap-envelope\"><RESULTAT xmlns=\"http://www.cnamts.fr/INSiResultat\" xmlns:ns0=\"http://www.cnamts.fr/INSiRecVit\" xmlns:ns1=\"http://www.cnamts.fr/INSiRecSans\"><CR><CodeCR>00</CodeCR><LibelleCR>OK</LibelleCR></CR><INDIVIDU><INSACTIF><IdIndividu><NumIdentifiant>2360663220836</NumIdentifiant><Cle>56</Cle></IdIndividu><OID>1.2.250.1.213.1.4.8</OID></INSACTIF><TIQ><NomNaissance>TCHITCHI</NomNaissance><ListePrenom>CATARINA BELLA</ListePrenom><Sexe>F</Sexe><DateNaissance>1936-06-21</DateNaissance><LieuNaissance>63220</LieuNaissance></TIQ></INDIVIDU></RESULTAT></env:Body></soap:Envelope>";
    }
    getFailedXmlResponse = (): string => "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\">\r\n  <S:Body xmlns:S=\"http://www.w3.org/2003/05/soap-envelope\">\r\n    <RESULTAT xmlns:ns3=\"http://www.cnamts.fr/INSiRecVit\" xmlns:ns2=\"http://www.cnamts.fr/INSiRecSans\" xmlns=\"http://www.cnamts.fr/INSiResultat\">\r\n      <CR>\r\n        <CodeCR>01</CodeCR>\r\n        <LibelleCR>Aucune identite trouvee</LibelleCR>\r\n      </CR>\r\n    </RESULTAT>\r\n  </S:Body>\r\n</soap:Envelope>";

    static getMockedResponse(person: INSiPersonArgs, requestId: string, {idam, version, name, requestDate}: {idam: string, version: string, name: string, requestDate: string}): INSiServiceFetchInsRequest[] {
        const tchitchiOlaVirtualMode = new TchitchiOlaVirtualMode();
        const listFirstName = person.firstName.split(' ');
        return [
            {
              status: INSiServiceRequestStatus.SUCCESS,
              request: {
                id: uuidv4(),
                xml: tchitchiOlaVirtualMode.getXmlRequest(person, listFirstName[0], requestDate, requestId, {
                    idam,
                    version,
                    name,
                })
              },
              response: {
                formatted: null,
                json: {
                  CR: {
                    CodeCR: CRCodes.NO_RESULT,
                    LibelleCR: CRLabels.NO_RESULT
                  },
                },
                xml: tchitchiOlaVirtualMode.getFailedXmlResponse(),
                error: null
              }
            },
            {
              status: INSiServiceRequestStatus.SUCCESS,
              request: {
                id: uuidv4(),
                xml: tchitchiOlaVirtualMode.getXmlRequest(person, listFirstName[1], requestDate, requestId, {
                  idam,
                  version,
                  name,
                })
              },
              response: {
                formatted: {
                    birthName: 'TCHITCHI',
                    firstName: 'CATARINA',
                    allFirstNames: 'CATARINA BELLA',
                    gender: Gender.Female,
                    dateOfBirth: '1936-06-21',
                    placeOfBirthCode: '63220',
                    registrationNumber: '236066322083656',
                    oid: '1.2.250.1.213.1.4.8',
                  },
                json: {
                    CR: {
                      CodeCR: CRCodes.OK,
                      LibelleCR: CRLabels.OK,
                    },
                    INDIVIDU: {
                      INSACTIF: {
                        IdIndividu: {
                          NumIdentifiant: '2360663220836',
                          Cle: '56'
                        },
                        OID: '1.2.250.1.213.1.4.8'
                      },
                      TIQ: {
                        NomNaissance: 'TCHITCHI',
                        ListePrenom: 'CATARINA BELLA',
                        Sexe: Gender.Female,
                        DateNaissance: '1936-06-21',
                        LieuNaissance: '63220'
                      }
                    }
                  },
                xml: tchitchiOlaVirtualMode.getValidXmlResponse(),
                error: null,
              }
            }
          ];
    }
}
