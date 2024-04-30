import { BamContext } from './bam-context.class';
const defaultUuid = '1f7425e2-b913-415c-adaa-785ee1076a70';
const defaultDate = '2020-01-01';
jest.mock('uuid', () => ({
  v4: () => defaultUuid,
  validate: (uuid: string) => uuid === defaultUuid, 
}));
jest.useFakeTimers().setSystemTime(new Date(defaultDate));

describe('BAM Context', () => {
  test('should be able to create a BAM Context and get his header as json', () => {
    const bamContext = new BamContext({
      emitter: 'medecin@yopmail.com',
    });

    const { soapHeader, name, namespace } = bamContext.getSoapHeaderAsJson();
    expect(name).toEqual('ContexteBAM');
    expect(namespace).toEqual('ctxbam');

    expect(soapHeader).toEqual({
      ContexteBAM: {
        attributes: {
          Version: '01_02',
        },
        Id: defaultUuid,
        Temps: (new Date(defaultDate)).toISOString(),
        Emetteur: 'medecin@yopmail.com',
        COUVERTURE: {},
      },
    });
  });

  test('should not be able to create an Bam Context if empty emitter', () => {
    expect(() => {
      new BamContext({ emitter: '' });
    }).toThrow('Fail to create a BamContext, you must provide an emitter');
  });
});
