"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INSiPerson = exports.Gender = void 0;
var Gender;
(function (Gender) {
    Gender["Male"] = "M";
    Gender["Female"] = "F";
})(Gender = exports.Gender || (exports.Gender = {}));
class INSiPerson {
    constructor({ lastName, firstName, gender, dateOfBirth, birthPlaceCode }) {
        if (!lastName) {
            throw new Error('Fail to create an INSiPerson, you must provide a lastName');
        }
        this.lastName = lastName;
        if (!firstName) {
            throw new Error('Fail to create an INSiPerson, you must provide a firstName');
        }
        this.firstName = firstName;
        if (!gender) {
            throw new Error('Fail to create an INSiPerson, you must provide a gender');
        }
        this.gender = gender;
        if (!this._isValidBirthDate(dateOfBirth)) {
            throw new Error('Fail to create an INSiPerson, you must provide a valid dateOfBirth');
        }
        this.dateOfBirth = dateOfBirth;
        this.birthPlaceCode = birthPlaceCode;
    }
    getSoapDataAsJson() {
        return Object.assign({ NomNaissance: this.lastName, Prenom: this.firstName, Sexe: this.gender, DateNaissance: this.dateOfBirth }, (this.birthPlaceCode ? { LieuNaissance: this.birthPlaceCode } : {}));
    }
    _isValidBirthDate(birthDate) {
        if (!/\d{4}-\d{2}-\d{2}/.test(birthDate))
            return false;
        return new Date(birthDate).toString() !== 'Invalid Date';
    }
}
exports.INSiPerson = INSiPerson;
//# sourceMappingURL=insi-person.class.js.map