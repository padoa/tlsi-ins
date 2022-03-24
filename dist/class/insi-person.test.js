"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const insi_person_class_1 = require("./insi-person.class");
describe('INSi Person', () => {
    test('should be able to create an INSi Person and get his data as json', () => {
        const insiPerson = new insi_person_class_1.INSiPerson({
            birthName: 'DAMPIERRE',
            firstName: 'ERIC',
            gender: insi_person_class_1.Gender.Male,
            dateOfBirth: '1990-01-01',
            placeOfBirthCode: '20020',
        });
        expect(insiPerson.getSoapBodyAsJson()).toEqual({
            NomNaissance: 'DAMPIERRE',
            Prenom: 'ERIC',
            Sexe: insi_person_class_1.Gender.Male,
            DateNaissance: '1990-01-01',
            LieuNaissance: '20020',
        });
    });
    test('should be able to create an INSi Person without placeOfBirthCode and get his data as json', () => {
        const insiPerson = new insi_person_class_1.INSiPerson({
            birthName: 'DAMPIERRE',
            firstName: 'ERIC',
            gender: insi_person_class_1.Gender.Male,
            dateOfBirth: '1990-01-01',
        });
        expect(insiPerson.getSoapBodyAsJson()).toEqual({
            NomNaissance: 'DAMPIERRE',
            Prenom: 'ERIC',
            Sexe: insi_person_class_1.Gender.Male,
            DateNaissance: '1990-01-01',
        });
    });
    test('should be able to create an INSi Person if birthName contains -', () => {
        const insiPerson = new insi_person_class_1.INSiPerson({
            birthName: 'DAMPI-ERRE',
            firstName: 'ERIC',
            gender: insi_person_class_1.Gender.Male,
            dateOfBirth: '1990-01-01',
        });
        expect(insiPerson.getSoapBodyAsJson()).toEqual({
            NomNaissance: 'DAMPI-ERRE',
            Prenom: 'ERIC',
            Sexe: insi_person_class_1.Gender.Male,
            DateNaissance: '1990-01-01',
        });
    });
    test('should be able to create an INSi Person if birthName contains --', () => {
        const insiPerson = new insi_person_class_1.INSiPerson({
            birthName: 'DAMPI--ERRE',
            firstName: 'ERIC',
            gender: insi_person_class_1.Gender.Male,
            dateOfBirth: '1990-01-01',
        });
        expect(insiPerson.getSoapBodyAsJson()).toEqual({
            NomNaissance: 'DAMPI--ERRE',
            Prenom: 'ERIC',
            Sexe: insi_person_class_1.Gender.Male,
            DateNaissance: '1990-01-01',
        });
    });
    test('should be able to create an INSi Person if birthName contains \'', () => {
        const insiPerson = new insi_person_class_1.INSiPerson({
            birthName: 'D\'AMPIERRE',
            firstName: 'ERIC',
            gender: insi_person_class_1.Gender.Male,
            dateOfBirth: '1990-01-01',
        });
        expect(insiPerson.getSoapBodyAsJson()).toEqual({
            NomNaissance: 'D\'AMPIERRE',
            Prenom: 'ERIC',
            Sexe: insi_person_class_1.Gender.Male,
            DateNaissance: '1990-01-01',
        });
    });
    test('should be able to create an INSi Person if birthName contains blank space', () => {
        const insiPerson = new insi_person_class_1.INSiPerson({
            birthName: 'DAMPI ERRE',
            firstName: 'ERIC',
            gender: insi_person_class_1.Gender.Male,
            dateOfBirth: '1990-01-01',
        });
        expect(insiPerson.getSoapBodyAsJson()).toEqual({
            NomNaissance: 'DAMPI ERRE',
            Prenom: 'ERIC',
            Sexe: insi_person_class_1.Gender.Male,
            DateNaissance: '1990-01-01',
        });
    });
    test('should not be able to create an INSi Person if empty birthName', () => {
        expect(() => {
            new insi_person_class_1.INSiPerson({
                birthName: '',
                firstName: 'ERIC',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1990-01-01',
                placeOfBirthCode: '20020',
            });
        }).toThrow('Fail to create an INSiPerson, you must provide a birthName');
    });
    test('should not be able to create an INSi Person if birthName contains lowercase letters', () => {
        expect(() => {
            new insi_person_class_1.INSiPerson({
                birthName: 'Dampierre',
                firstName: 'ERIC',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1990-01-01',
                placeOfBirthCode: '20020',
            });
        }).toThrow('Fail to create an INSiPerson, the birthName you provided is not in the correct format');
    });
    test('should not be able to create an INSi Person if birthName starts with a blank', () => {
        expect(() => {
            new insi_person_class_1.INSiPerson({
                birthName: ' DAMPIERRE',
                firstName: 'ERIC',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1990-01-01',
                placeOfBirthCode: '20020',
            });
        }).toThrow('Fail to create an INSiPerson, the birthName you provided is not in the correct format');
    });
    test('should not be able to create an INSi Person if birthName contains another character than those found in names', () => {
        expect(() => {
            new insi_person_class_1.INSiPerson({
                birthName: 'DAMPI_ERRE',
                firstName: 'ERIC',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1990-01-01',
                placeOfBirthCode: '20020',
            });
        }).toThrow('Fail to create an INSiPerson, the birthName you provided is not in the correct format');
    });
    test('should be able to create an INSi Person if firstName contains -', () => {
        const insiPerson = new insi_person_class_1.INSiPerson({
            birthName: 'DAMPIERRE',
            firstName: 'ER-IC',
            gender: insi_person_class_1.Gender.Male,
            dateOfBirth: '1990-01-01',
        });
        expect(insiPerson.getSoapBodyAsJson()).toEqual({
            NomNaissance: 'DAMPIERRE',
            Prenom: 'ER-IC',
            Sexe: insi_person_class_1.Gender.Male,
            DateNaissance: '1990-01-01',
        });
    });
    test('should be able to create an INSi Person if firstName contains --', () => {
        const insiPerson = new insi_person_class_1.INSiPerson({
            birthName: 'DAMPIERRE',
            firstName: 'ER--IC',
            gender: insi_person_class_1.Gender.Male,
            dateOfBirth: '1990-01-01',
        });
        expect(insiPerson.getSoapBodyAsJson()).toEqual({
            NomNaissance: 'DAMPIERRE',
            Prenom: 'ER--IC',
            Sexe: insi_person_class_1.Gender.Male,
            DateNaissance: '1990-01-01',
        });
    });
    test('should be able to create an INSi Person if firstName contains \'', () => {
        const insiPerson = new insi_person_class_1.INSiPerson({
            birthName: 'DAMPIERRE',
            firstName: 'E\'RIC',
            gender: insi_person_class_1.Gender.Male,
            dateOfBirth: '1990-01-01',
        });
        expect(insiPerson.getSoapBodyAsJson()).toEqual({
            NomNaissance: 'DAMPIERRE',
            Prenom: 'E\'RIC',
            Sexe: insi_person_class_1.Gender.Male,
            DateNaissance: '1990-01-01',
        });
    });
    test('should be able to create an INSi Person if firstName contains a blank space', () => {
        const insiPerson = new insi_person_class_1.INSiPerson({
            birthName: 'DAMPIERRE',
            firstName: 'ER IC',
            gender: insi_person_class_1.Gender.Male,
            dateOfBirth: '1990-01-01',
        });
        expect(insiPerson.getSoapBodyAsJson()).toEqual({
            NomNaissance: 'DAMPIERRE',
            Prenom: 'ER IC',
            Sexe: insi_person_class_1.Gender.Male,
            DateNaissance: '1990-01-01',
        });
    });
    test('should not be able to create an INSi Person if empty firstName', () => {
        expect(() => {
            new insi_person_class_1.INSiPerson({
                birthName: 'DAMPIERRE',
                firstName: '',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1990-01-01',
                placeOfBirthCode: '20020',
            });
        }).toThrow('Fail to create an INSiPerson, you must provide a firstName');
    });
    test('should not be able to create an INSi Person if firstName contains lowercase letters', () => {
        expect(() => {
            new insi_person_class_1.INSiPerson({
                birthName: 'DAMPIERRE',
                firstName: 'Eric',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1990-01-01',
                placeOfBirthCode: '20020',
            });
        }).toThrow('Fail to create an INSiPerson, the firstName you provided is not in the correct format');
    });
    test('should not be able to create an INSi Person if firstName starts with a blank', () => {
        expect(() => {
            new insi_person_class_1.INSiPerson({
                birthName: 'DAMPIERRE',
                firstName: ' ERIC',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1990-01-01',
                placeOfBirthCode: '20020',
            });
        }).toThrow('Fail to create an INSiPerson, the firstName you provided is not in the correct format');
    });
    test('should not be able to create an INSi Person if firstName contains another character than those found in names', () => {
        expect(() => {
            new insi_person_class_1.INSiPerson({
                birthName: 'DAMPIERRE',
                firstName: 'ER_IC',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '1990-01-01',
                placeOfBirthCode: '20020',
            });
        }).toThrow('Fail to create an INSiPerson, the firstName you provided is not in the correct format');
    });
    test('should not be able to create an INSi Person if empty dateOfBirth', () => {
        expect(() => {
            new insi_person_class_1.INSiPerson({
                birthName: 'DAMPIERRE',
                firstName: 'ERIC',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '',
                placeOfBirthCode: '20020',
            });
        }).toThrow('Fail to create an INSiPerson, you must provide a valid dateOfBirth');
    });
    test('should not be able to create an INSi Person if dateOfBirth is not valid', () => {
        expect(() => {
            new insi_person_class_1.INSiPerson({
                birthName: 'DAMPIERRE',
                firstName: 'ERIC',
                gender: insi_person_class_1.Gender.Male,
                dateOfBirth: '2021-56-12',
                placeOfBirthCode: '20020',
            });
        }).toThrow('Fail to create an INSiPerson, you must provide a valid dateOfBirth');
    });
});
//# sourceMappingURL=insi-person.test.js.map