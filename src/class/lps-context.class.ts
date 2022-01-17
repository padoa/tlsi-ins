import { v4 as uuidv4 } from 'uuid';
import { ILpsSoapHeader, LPS } from './lps.class';
import moment from 'moment';
import { HEADER_DATE_FORMAT } from '../models/insi-format.models';

export interface ILpsContextData {
  emitter: string;
  lps: LPS;
}

export interface ILpsContextOptions {
  id?: string;
  dateTime?: string;
}

export interface ILpsContextSoapHeader {
  ContexteLPS: {
    attributes: {
      Nature: string,
      Version: string,
    },
    Id: string,
    Temps: string,
    Emetteur: string,
    LPS: ILpsSoapHeader,
  }
}

export class LpsContext {
  id: string;
  dateTime: string;
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
    return {
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
  }
}
