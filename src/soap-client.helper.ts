import moment from 'moment';
import { SOAPINSConfig } from './soap-client.service';

const HEADER_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

export class SoapClientHelper {
  public static getBAMContext(bamCtxId: string, { emitter }: SOAPINSConfig): object {
    return {
      ContexteBAM: {
        attributes: {
          Version: '01_02',
        },
        Id: bamCtxId,
        Temps: moment().format(HEADER_DATE_FORMAT),
        Emetteur: emitter,
        COUVERTURE: {},
      },
    };
  }

  public static getLPSContext(lpsCtxId: string, lpsCtxInstance: string, config: SOAPINSConfig): object {
    return {
      ContexteLPS: {
        attributes: {
          Nature: 'CTXLPS',
          Version: '01_00',
        },
        Id: lpsCtxId,
        Temps: moment().format(HEADER_DATE_FORMAT),
        Emetteur: config.emitter,
        LPS: {
          IDAM: {
            attributes: { R: 4 },
            $value: config.IDAMAutorisationNumber,
          },
          Version: config.softwareVersion,
          Instance: lpsCtxInstance,
          Nom: config.softwareName,
        },
      }
    };
  }
}
