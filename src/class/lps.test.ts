import { LPS } from './lps.class';
import { validate as validateUUID } from 'uuid';

describe('LPS class', () => {
  test('should be able to create an LPS and get his header as json', () => {
    const lps = new LPS({
      idam: 'GDF1TNF51DK9',
      version: '2022',
      name: 'docto-solution',
    }, {
      id: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
    });

    expect(lps.getSoapHeaderAsJson()).toEqual({
      IDAM: {
        attributes: { R: 4 },
        $value: 'GDF1TNF51DK9',
      },
      Version: '2022',
      Instance: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
      Nom: 'urn:lps:docto-solution:2022',
    });
  });

  test('should generate a valid UUID as id', () => {
    const myLps = new LPS({
      idam: 'GDF1TNF51DK9',
      version: '2022',
      name: 'docto-solution',
    });

    expect(validateUUID(myLps.id));
  });

  test('should not be able to create an LPS if empty IDAM', () => {
    expect(() => {
      new LPS({
        idam: '',
        version: '2022',
        name: 'docto-solution',
      });
    }).toThrow('Fail to create a LPS, you must provide an idam');
  });

  test('should not be able to create an LPS if empty version', () => {
    expect(() => {
      new LPS({
        idam: 'GDF1TNF51DK9',
        version: '',
        name: 'docto-solution',
      });
    }).toThrow('Fail to create a LPS, you must provide a version');
  });

  test('should not be able to create an LPS if empty name', () => {
    expect(() => {
      new LPS({
        idam: 'GDF1TNF51DK9',
        version: '2022',
        name: '',
      });
    }).toThrow('Fail to create a LPS, you must provide a name');
  });
});
