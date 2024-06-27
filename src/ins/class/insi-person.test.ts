import { Gender, INSiPerson } from './insi-person.class';

describe('INSi Person', () => {
  test('should be able to create an INSi Person and get his data as json', () => {
    const insiPerson = new INSiPerson({
      birthName: 'DAMPIERRE',
      firstName: 'ERIC',
      gender: Gender.Male,
      dateOfBirth: '1990-01-01',
      placeOfBirthCode: '2A020',
    });

    expect(insiPerson.getSoapBodyAsJson()).toEqual([{
      NomNaissance: 'DAMPIERRE',
      Prenom: 'ERIC',
      Sexe: Gender.Male,
      DateNaissance: '1990-01-01',
      LieuNaissance: '2A020',
    }]);
  });

  test('should be able to create an INSi Person without placeOfBirthCode and get his data as json', () => {
    const insiPerson = new INSiPerson({
      birthName: 'DAMPIERRE',
      firstName: 'ERIC',
      gender: Gender.Male,
      dateOfBirth: '1990-01-01',
    });

    expect(insiPerson.getSoapBodyAsJson()).toEqual([{
      NomNaissance: 'DAMPIERRE',
      Prenom: 'ERIC',
      Sexe: Gender.Male,
      DateNaissance: '1990-01-01',
    }]);
  });

  test('should be able to create an INSi Person if birthName contains -', () => {
    const insiPerson = new INSiPerson({
      birthName: 'DAMPI-ERRE',
      firstName: 'ERIC',
      gender: Gender.Male,
      dateOfBirth: '1990-01-01',
    });

    expect(insiPerson.getSoapBodyAsJson()).toEqual([{
      NomNaissance: 'DAMPI-ERRE',
      Prenom: 'ERIC',
      Sexe: Gender.Male,
      DateNaissance: '1990-01-01',
    }]);
  });

  test('should be able to create an INSi Person if birthName contains --', () => {
    const insiPerson = new INSiPerson({
      birthName: 'DAMPI--ERRE',
      firstName: 'ERIC',
      gender: Gender.Male,
      dateOfBirth: '1990-01-01',
    });

    expect(insiPerson.getSoapBodyAsJson()).toEqual([{
      NomNaissance: 'DAMPI--ERRE',
      Prenom: 'ERIC',
      Sexe: Gender.Male,
      DateNaissance: '1990-01-01',
    }]);
  });

  test('should be able to create an INSi Person if birthName contains \'', () => {
    const insiPerson = new INSiPerson({
      birthName: 'D\'AMPIERRE',
      firstName: 'ERIC',
      gender: Gender.Male,
      dateOfBirth: '1990-01-01',
    });

    expect(insiPerson.getSoapBodyAsJson()).toEqual([{
      NomNaissance: 'D\'AMPIERRE',
      Prenom: 'ERIC',
      Sexe: Gender.Male,
      DateNaissance: '1990-01-01',
    }]);
  });

  test('should be able to create an INSi Person if birthName contains blank space', () => {
    const insiPerson = new INSiPerson({
      birthName: 'DAMPI ERRE',
      firstName: 'ERIC',
      gender: Gender.Male,
      dateOfBirth: '1990-01-01',
    });

    expect(insiPerson.getSoapBodyAsJson()).toEqual([{
      NomNaissance: 'DAMPI ERRE',
      Prenom: 'ERIC',
      Sexe: Gender.Male,
      DateNaissance: '1990-01-01',
    }]);
  });

  test('should not be able to create an INSi Person if empty birthName', () => {
    expect(() => {
      new INSiPerson({
        birthName: '',
        firstName: 'ERIC',
        gender: Gender.Male,
        dateOfBirth: '1990-01-01',
        placeOfBirthCode: '2A020',
      });
    }).toThrow('Fail to create an INSiPerson, you must provide a birthName');
  });

  test('should not be able to create an INSi Person if birthName contains lowercase letters', () => {
    expect(() => {
      new INSiPerson({
        birthName: 'Dampierre',
        firstName: 'ERIC',
        gender: Gender.Male,
        dateOfBirth: '1990-01-01',
        placeOfBirthCode: '2A020',
      });
    }).toThrow('Fail to create an INSiPerson, the birthName you provided is not in the correct format');
  });

  test('should not be able to create an INSi Person if birthName starts with a blank', () => {
    expect(() => {
      new INSiPerson({
        birthName: ' DAMPIERRE',
        firstName: 'ERIC',
        gender: Gender.Male,
        dateOfBirth: '1990-01-01',
        placeOfBirthCode: '2A020',
      });
    }).toThrow('Fail to create an INSiPerson, the birthName you provided is not in the correct format');
  });

  test('should not be able to create an INSi Person if birthName contains another character than those found in names', () => {
    expect(() => {
      new INSiPerson({
        birthName: 'DAMPI_ERRE',
        firstName: 'ERIC',
        gender: Gender.Male,
        dateOfBirth: '1990-01-01',
        placeOfBirthCode: '2A020',
      });
    }).toThrow('Fail to create an INSiPerson, the birthName you provided is not in the correct format');
  });

  test('should be able to create an INSi Person if firstName contains -', () => {
    const insiPerson = new INSiPerson({
      birthName: 'DAMPIERRE',
      firstName: 'ER-IC',
      gender: Gender.Male,
      dateOfBirth: '1990-01-01',
    });

    expect(insiPerson.getSoapBodyAsJson()).toEqual([{
      NomNaissance: 'DAMPIERRE',
      Prenom: 'ER-IC',
      Sexe: Gender.Male,
      DateNaissance: '1990-01-01',
    }]);
  });

  test('should be able to create an INSi Person if firstName contains --', () => {
    const insiPerson = new INSiPerson({
      birthName: 'DAMPIERRE',
      firstName: 'ER--IC',
      gender: Gender.Male,
      dateOfBirth: '1990-01-01',
    });

    expect(insiPerson.getSoapBodyAsJson()).toEqual([{
      NomNaissance: 'DAMPIERRE',
      Prenom: 'ER--IC',
      Sexe: Gender.Male,
      DateNaissance: '1990-01-01',
    }]);
  });

  test('should be able to create an INSi Person if firstName contains \'', () => {
    const insiPerson = new INSiPerson({
      birthName: 'DAMPIERRE',
      firstName: 'E\'RIC',
      gender: Gender.Male,
      dateOfBirth: '1990-01-01',
    });

    expect(insiPerson.getSoapBodyAsJson()).toEqual([{
      NomNaissance: 'DAMPIERRE',
      Prenom: 'E\'RIC',
      Sexe: Gender.Male,
      DateNaissance: '1990-01-01',
    }]);
  });

  test('should not be able to create an INSi Person if empty firstName', () => {
    expect(() => {
      new INSiPerson({
        birthName: 'DAMPIERRE',
        firstName: '',
        gender: Gender.Male,
        dateOfBirth: '1990-01-01',
        placeOfBirthCode: '2A020',
      });
    }).toThrow('Fail to create an INSiPerson, you must provide a firstName');
  });

  test('should not be able to create an INSi Person if firstName contains lowercase letters', () => {
    expect(() => {
      new INSiPerson({
        birthName: 'DAMPIERRE',
        firstName: 'Eric',
        gender: Gender.Male,
        dateOfBirth: '1990-01-01',
        placeOfBirthCode: '2A020',
      });
    }).toThrow('Fail to create an INSiPerson, the firstName you provided is not in the correct format');
  });

  test('should not be able to create an INSi Person if firstName starts with a blank', () => {
    expect(() => {
      new INSiPerson({
        birthName: 'DAMPIERRE',
        firstName: ' ERIC',
        gender: Gender.Male,
        dateOfBirth: '1990-01-01',
        placeOfBirthCode: '2A020',
      });
    }).toThrow('Fail to create an INSiPerson, the firstName you provided is not in the correct format');
  });

  test('should not be able to create an INSi Person if firstName contains another character than those found in names', () => {
    expect(() => {
      new INSiPerson({
        birthName: 'DAMPIERRE',
        firstName: 'ER_IC',
        gender: Gender.Male,
        dateOfBirth: '1990-01-01',
        placeOfBirthCode: '2A020',
      });
    }).toThrow('Fail to create an INSiPerson, the firstName you provided is not in the correct format');
  });

  test('should not be able to create an INSi Person if empty dateOfBirth', () => {
    expect(() => {
      new INSiPerson({
        birthName: 'DAMPIERRE',
        firstName: 'ERIC',
        gender: Gender.Male,
        dateOfBirth: '',
        placeOfBirthCode: '2A020',
      });
    }).toThrow('Fail to create an INSiPerson, you must provide a valid dateOfBirth');
  });

  test('should not be able to create an INSi Person if dateOfBirth is not valid', () => {
    expect(() => {
      new INSiPerson({
        birthName: 'DAMPIERRE',
        firstName: 'ERIC',
        gender: Gender.Male,
        dateOfBirth: '2021-56-12',
        placeOfBirthCode: '2A020',
      });
    }).toThrow('Fail to create an INSiPerson, you must provide a valid dateOfBirth');
  });

  test('should return all components of firstName', () => {
    const insiPerson = new INSiPerson({
      birthName: 'DAMPIERRE',
      firstName: 'ERIC MATHIEU',
      gender: Gender.Male,
      dateOfBirth: '1990-01-01',
    });

    expect(insiPerson.getSoapBodyAsJson()).toEqual([
      {
        NomNaissance: 'DAMPIERRE',
        Prenom: 'ERIC',
        Sexe: Gender.Male,
        DateNaissance: '1990-01-01',
      },
      {
        NomNaissance: 'DAMPIERRE',
        Prenom: 'MATHIEU',
        Sexe: Gender.Male,
        DateNaissance: '1990-01-01',
      },
      {
        NomNaissance: 'DAMPIERRE',
        Prenom: 'ERIC MATHIEU',
        Sexe: Gender.Male,
        DateNaissance: '1990-01-01',
      }
    ]);
  });
});
