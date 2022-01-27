import { v4 as uuidv4 } from 'uuid';
import { LpsSoapHeader, LPS } from './lps.class';

export interface LpsContextArgs {
  emitter: string;
  lps: LPS;
}

export interface LpsContextOptions {
  id?: string; // UUID
  dateTime?: string; // YYYY-MM-DDTHH:mm:ss.sssZ
}

export interface LpsContextSoapHeader {
  soapHeader: {
    ContexteLPS: {
      attributes: {
        Nature: string;
        Version: string;
      };
      Id: string; // UUID
      Temps: string; // YYYY-MM-DDTHH:mm:ss.sssZ
      Emetteur: string;
      LPS: LpsSoapHeader;
    };
  };
  name: string;
  namespace: string;
}


export class LpsContext {
  id: string; // UUID
  dateTime: string; // YYYY-MM-DDTHH:mm:ss.sssZ
  emitter: string;
  lps: LPS;

  constructor(
    { emitter, lps }: LpsContextArgs,
    { id, dateTime }: LpsContextOptions = {},
  ) {
    if (!emitter) {
      throw new Error('Fail to create a LpsContext, you must provide an emitter');
    }
    this.emitter = emitter;
    if (!lps) {
      throw new Error('Fail to create a LpsContext, you must provide a lps');
    }
    this.lps = lps;
    this.id = id || uuidv4();
    this.dateTime = dateTime || new Date().toISOString();
  }

  public getSoapHeaderAsJson(): LpsContextSoapHeader {
    const soapHeader = {
      ContexteLPS: {
        attributes: {
          Nature: 'CTXLPS',
          Version: '01_00',
        },
        Id: this.id,
        Temps: this.dateTime,
        Emetteur: this.emitter,
        LPS: this.lps.getSoapHeaderAsJson(),
      }
    };
    const name = 'ContexteLPS';
    const namespace = 'ctxlps';
    return { soapHeader, name, namespace };
  }
}
