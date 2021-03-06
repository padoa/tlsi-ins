import { v4 as uuidv4 } from 'uuid';

export interface BamContextArgs {
  emitter: string;
}

export interface BamContextOptions {
  id?: string; // UUID
  dateTime?: string; // YYYY-MM-DDTHH:mm:ss.sssZ
}

export interface BamContextSoapHeader {
  soapHeader: {
    ContexteBAM: {
      attributes: {
        Version: string,
      },
      Id: string, // UUID
      Temps: string, // YYYY-MM-DDTHH:mm:ss.sssZ
      Emetteur: string,
      COUVERTURE: {}, // The balise should be included be still but empty since we don't use the "Carte Vitale"
    },
  };
  name: string;
  namespace: string;
}

export class BamContext {
  emitter: string;

  constructor(
    { emitter }: BamContextArgs,
  ) {
    if (!emitter) {
      throw new Error('Fail to create a BamContext, you must provide an emitter');
    }
    this.emitter = emitter;
  }

  public getSoapHeaderAsJson(): BamContextSoapHeader {
    const soapHeader = {
      ContexteBAM: {
        attributes: {
          Version: '01_02',
        },
        Id: uuidv4(),
        Temps: new Date().toISOString(),
        Emetteur: this.emitter,
        COUVERTURE: {},
      },
    };
    const name = 'ContexteBAM';
    const namespace = 'ctxbam';
    return { soapHeader, name, namespace };
  }
}
