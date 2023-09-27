import {
  INSiServiceResponse,
} from '../../models/insi-fetch-ins.models';

const getCoeurAeionXmlRequest: string = "<?xml version=\"1.0\" encoding=\"utf-8\"?><soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"  xmlns:tns=\"http://www.cnamts.fr/webservice\" xmlns:insi=\"http://www.cnamts.fr/ServiceIdentiteCertifiee/v1\" xmlns:insi_recsans_ins=\"http://www.cnamts.fr/INSiRecSans\" xmlns:insi_recvit_ins=\"http://www.cnamts.fr/INSiRecVit\" xmlns:insi_resultat_ins=\"http://www.cnamts.fr/INSiResultat\" xmlns:wsse=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\" xmlns:ctxbam=\"urn:siram:bam:ctxbam\" xmlns:ctxlps=\"urn:siram:lps:ctxlps\" xmlns:siram=\"urn:siram\" xmlns:jaxb=\"http://java.sun.com/xml/ns/jaxb\" xmlns:xjc=\"http://java.sun.com/xml/ns/jaxb/xjc\"><soap:Header><ctxbam:ContexteBAM Version=\"01_02\"><ctxbam:Id>4994d193-31fb-4dd9-8b64-90004c072f68</ctxbam:Id><ctxbam:Temps>2023-09-26T08:51:16.840Z</ctxbam:Temps><ctxbam:Emetteur>10B0152872</ctxbam:Emetteur><ctxbam:COUVERTURE></ctxbam:COUVERTURE></ctxbam:ContexteBAM> <ctxlps:ContexteLPS Nature=\"CTXLPS\" Version=\"01_00\"><ctxlps:Id>65313e45-3066-4210-a3a7-57d6a8c557f1</ctxlps:Id><ctxlps:Temps>2023-09-26T08:51:16.840Z</ctxlps:Temps><ctxlps:Emetteur>10B0152872</ctxlps:Emetteur><ctxlps:LPS><ctxlps:IDAM R=\"4\">PDP17NF21DD0</ctxlps:IDAM><ctxlps:Version>2022</ctxlps:Version><ctxlps:Instance>636c9d43-1a19-5b8c-a8b1-ac43227cfe46</ctxlps:Instance><ctxlps:Nom>urn:lps:padoa:2022</ctxlps:Nom></ctxlps:LPS></ctxlps:ContexteLPS> <wsa:Action xmlns:wsa=\"http://www.w3.org/2005/08/addressing\" xmlns=\"http://www.w3.org/2005/08/addressing\">urn:ServiceIdentiteCertifiee:1.0.0:rechercherInsAvecTraitsIdentite</wsa:Action> <wsa:MessageID xmlns:wsa=\"http://www.w3.org/2005/08/addressing\" xmlns=\"http://www.w3.org/2005/08/addressing\">uuid:4bb69d9e-064f-4dc3-836a-db69046e439a</wsa:MessageID></soap:Header><soap:Body><insi_recsans_ins:RECSANSVITALE xmlns:insi_recsans_ins=\"http://www.cnamts.fr/INSiRecSans\" xmlns=\"http://www.cnamts.fr/INSiRecSans\"><insi_recsans_ins:NomNaissance>D&apos;AEION</insi_recsans_ins:NomNaissance><insi_recsans_ins:Prenom>COEUR</insi_recsans_ins:Prenom><insi_recsans_ins:Sexe>M</insi_recsans_ins:Sexe><insi_recsans_ins:DateNaissance>1987-01-25</insi_recsans_ins:DateNaissance></insi_recsans_ins:RECSANSVITALE></soap:Body></soap:Envelope>";

const getCoeurAeionXmlResponse: string = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\"><env:Body xmlns:S=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:env=\"http://www.w3.org/2003/05/soap-envelope\"><S:Fault xmlns:ns4=\"http://schemas.xmlsoap.org/soap/envelope/\"><S:Code><S:Value>S:Receiver</S:Value><S:Subcode><S:Value>S:siram_40</S:Value></S:Subcode></S:Code><S:Reason><S:Text xml:lang=\"en\">Le service est temporairement inaccessible. Veuillez renouveler votre demande ultérieurement. Si le problème persiste, contactez l'éditeur du progiciel ou votre responsable informatique.</S:Text></S:Reason><S:Detail><siram:Erreur severite=\"fatal\" code=\"insi_102\" xmlns:siram=\"urn:siram\">L'appel au service de recherche avec les traits d'identité renvoie une erreur technique.</siram:Erreur></S:Detail></S:Fault></env:Body></soap:Envelope>";

const getCoeurAeionResponse = (): INSiServiceResponse => ({
  formatted: null,
  json: null,
  xml: getCoeurAeionXmlResponse,
  error: {
    "siramCode": "siram_40",
    "text": "Le service est temporairement inaccessible. Veuillez renouveler votre demande ultérieurement. Si le problème persiste, contactez l'éditeur du progiciel ou votre responsable informatique.",
    "desirCode": "insi_102",
    "error": "L'appel au service de recherche avec les traits d'identité renvoie une erreur technique."
  },
});

export const getCoeurMockedResponse = (): any => {
  return [
    {
      status: 'FAIL',
      request: {
        id: "b3d188ab-8bc5-4e75-b217-a0ecf58a6953",
        xml: getCoeurAeionXmlRequest
      },
      response: getCoeurAeionResponse()
    }
  ];
};