import { LpsContext } from './lps-context.class';
import { validate as validateUUID } from 'uuid';
import { LPS } from './lps.class';

const defaultUuid = '1f7425e2-b913-415c-adaa-785ee1076a70';
const defaultDate = '2020-01-01';
jest.mock('uuid', () => ({
  v4: () => defaultUuid,
  validate: (uuid: string) => uuid === defaultUuid, 
}));
jest.useFakeTimers().setSystemTime(new Date(defaultDate));

describe('LPS Context', () => {
  let lps: LPS;

  test('should be able to create an LPS Context and get his header as json', () => {
    lps = new LPS({
      idam: 'GDF1TNF51DK9',
      version: '2022',
      name: 'docto-solution',
    }, {
      id: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
    });
    const lpsContext = new LpsContext({
      emitter: 'medecin@yopmail.com',
      lps,
    });

    const { soapHeader, name, namespace } = lpsContext.getSoapHeaderAsJson();
    expect(name).toEqual('ContexteLPS');
    expect(namespace).toEqual('ctxlps');
    expect(soapHeader).toEqual({
      ContexteLPS: {
        attributes: {
          Nature: 'CTXLPS',
          Version: '01_00',
        },
        Id: defaultUuid,
        Temps: new Date(defaultDate).toISOString(),
        Emetteur: 'medecin@yopmail.com',
        LPS: {
          IDAM: {
            attributes: { R: 4 },
            $value: 'GDF1TNF51DK9',
          },
          Version: '2022',
          Instance: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
          Nom: 'urn:lps:docto-solution:2022',
        },
      }
    });
  });

  test('should not be able to create an LPS Context if empty emitter', () => {
    expect(() => {
      new LpsContext({ emitter: '', lps });
    }).toThrow('Fail to create a LpsContext, you must provide an emitter');
  });
});
