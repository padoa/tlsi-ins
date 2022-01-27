"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INSiPerson = exports.Gender = void 0;
var Gender;
(function (Gender) {
    Gender["Male"] = "M";
    Gender["Female"] = "F";
})(Gender = exports.Gender || (exports.Gender = {}));
class INSiPerson {
    constructor(personArgs) {
        if (!personArgs.birthName) {
            throw new Error('Fail to create an INSiPerson, you must provide a birthName');
        }
        if (!personArgs.firstName) {
            throw new Error('Fail to create an INSiPerson, you must provide a firstName');
        }
        if (!personArgs.gender) {
            throw new Error('Fail to create an INSiPerson, you must provide a gender');
        }
        if (!this._isValidBirthDate(personArgs.dateOfBirth)) {
            throw new Error('Fail to create an INSiPerson, you must provide a valid dateOfBirth');
        }
        this._person = personArgs;
    }
    getSoapBodyAsJson() {
        const { birthName, firstName, gender, dateOfBirth, placeOfBirthCode } = this._person;
        return Object.assign({ NomNaissance: birthName, Prenom: firstName, Sexe: gender, DateNaissance: dateOfBirth }, (placeOfBirthCode ? { LieuNaissance: placeOfBirthCode } : {}));
    }
    _isValidBirthDate(dateOfBirth) {
        if (!/\d{4}-\d{2}-\d{2}/.test(dateOfBirth))
            return false;
        return new Date(dateOfBirth).toString() !== 'Invalid Date';
    }
}
exports.INSiPerson = INSiPerson;
//# sourceMappingURL=insi-person.class.js.map