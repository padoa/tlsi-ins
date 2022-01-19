import { v4 as uuidv4 } from 'uuid';
import { ILpsSoapHeader, LPS } from './lps.class';

export interface ILpsContextData {
  emitter: string;
  lps: LPS;
}

export interface ILpsContextOptions {
  id?: string; // UUID
  dateTime?: string; // YYYY-MM-DDTHH:mm:ss.sssZ
}

export interface ILpsContextSoapHeader {
  soapHeader: {
    ContexteLPS: {
      attributes: {
        Nature: string;
        Version: string;
      };
      Id: string; // UUID
      Temps: string; // YYYY-MM-DDTHH:mm:ss.sssZ
      Emetteur: string;
      LPS: ILpsSoapHeader;
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
    { emitter, lps }: ILpsContextData,
    { id, dateTime }: ILpsContextOptions = {},
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

  public getSoapHeaderAsJson(): ILpsContextSoapHeader {
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
