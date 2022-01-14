import { v4 as uuidv4 } from 'uuid';
import { ILpsSoapHeader, LPS } from './lps.class';
import moment from 'moment';
import { HEADER_DATE_FORMAT } from '../models/insi-format.models';

export interface ILpsContextData {
  emitter: string;
  lps: LPS;
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
  dateTime: Date;
  emitter: string;
  lps: LPS;

  constructor({ emitter, lps }: ILpsContextData) {
    this.emitter = emitter;
    this.lps = lps;
    this.id = uuidv4();
    this.dateTime = new Date();
  }

  public getSoapHeader(): ILpsContextSoapHeader {
    return {
      ContexteLPS: {
        attributes: {
          Nature: 'CTXLPS',
          Version: '01_00',
        },
        Id: this.id,
        Temps: moment(this.dateTime).format(HEADER_DATE_FORMAT),
        Emetteur: this.emitter,
        LPS: this.lps.getSoapHeader(),
      }
    };
  }
}
