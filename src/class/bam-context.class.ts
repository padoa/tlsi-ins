import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { HEADER_DATE_FORMAT } from '../models/insi-format.models';

interface IBamContextData {
  emitter: string;
}

export class BamContext {
  id: string;
  dateTime: Date;
  emitter: string;

  constructor({ emitter }: IBamContextData) {
    this.emitter = emitter;
    this.id = uuidv4();
    this.dateTime = new Date();
  }

  public getSoapHeader() {
    return {
      ContexteBAM: {
        attributes: {
          Version: '01_02',
        },
        Id: this.id,
        Temps: moment(this.dateTime).format(HEADER_DATE_FORMAT),
        Emetteur: this.emitter,
        COUVERTURE: {},
      },
    };
  }
}
