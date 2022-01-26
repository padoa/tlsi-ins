"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INSiPerson = exports.Gender = void 0;
var Gender;
(function (Gender) {
    Gender["Male"] = "M";
    Gender["Female"] = "F";
})(Gender = exports.Gender || (exports.Gender = {}));
class INSiPerson {
    constructor({ formerName, firstName, gender, birthDate, birthPlaceCode }) {
        if (!formerName) {
            throw new Error('Fail to create an INSiPerson, you must provide a formerName');
        }
        this.formerName = formerName;
        if (!firstName) {
            throw new Error('Fail to create an INSiPerson, you must provide a firstName');
        }
        this.firstName = firstName;
        if (!gender) {
            throw new Error('Fail to create an INSiPerson, you must provide a gender');
        }
        this.gender = gender;
        if (!this._isValidBirthDate(birthDate)) {
            throw new Error('Fail to create an INSiPerson, you must provide a valid birthDate');
        }
        this.birthDate = birthDate;
        this.birthPlaceCode = birthPlaceCode;
    }
    getSoapDataAsJson() {
        return Object.assign({ NomNaissance: this.formerName, Prenom: this.firstName, Sexe: this.gender, DateNaissance: this.birthDate }, (this.birthPlaceCode ? { LieuNaissance: this.birthPlaceCode } : {}));
    }
    _isValidBirthDate(birthDate) {
        if (!/\d{4}-\d{2}-\d{2}/.test(birthDate))
            return false;
        return new Date(birthDate).toString() !== 'Invalid Date';
    }
}
exports.INSiPerson = INSiPerson;
//# sourceMappingURL=insi-person.class.js.map