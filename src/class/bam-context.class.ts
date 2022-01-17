import { v4 as uuidv4 } from 'uuid';

export interface IBamContextData {
  emitter: string;
}

export interface IBamContextOptions {
  id?: string; // UUID
  dateTime?: string;
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

  public getSoapHeaderAsJson() {
    return {
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
  }
}
