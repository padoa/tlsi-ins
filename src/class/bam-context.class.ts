import { v4 as uuidv4 } from 'uuid';

export interface IBamContextData {
  emitter: string;
}

export interface IBamContextOptions {
  id?: string; // UUID
  dateTime?: string;
}

export interface IBamContextSoapHeader {
  soapHeader: {
    ContexteBAM: {
      attributes: {
        Version: string,
      },
      Id: string,
      Temps: string,
      Emetteur: string,
      COUVERTURE: {},
    },
  };
  name: string;
  namespace: string;
}

export class BamContext {
  id: string; // UUID
  dateTime: string;
  emitter: string;

  constructor(
    { emitter }: IBamContextData,
    { id, dateTime }: IBamContextOptions = {},
  ) {
    if (!emitter) {
      throw new Error('Fail to create a BamContext, you must provide an emitter');
    }
    this.emitter = emitter;
    this.id = id || uuidv4();
    this.dateTime = dateTime || new Date().toISOString();
  }

  public getSoapHeaderAsJson(): IBamContextSoapHeader {
    const soapHeader = {
      ContexteBAM: {
        attributes: {
          Version: '01_02',
        },
        Id: this.id,
        Temps: this.dateTime,
        Emetteur: this.emitter,
        COUVERTURE: {},
      },
    };
    const name = 'ContexteBAM';
    const namespace = 'ctxbam';
    return { soapHeader, name, namespace };
  }
}
