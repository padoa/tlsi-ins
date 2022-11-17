"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeVinciLeonardoXmlRequest = void 0;
const insi_client_fixture_1 = require("../insi-client.fixture");
const insi_person_class_1 = require("../../class/insi-person.class");
const getDeVinciLeonardoXmlRequest = ({ idam, version, name }) => (0, insi_client_fixture_1.getCNDAValidationXmlRequest)({
    idam,
    version,
    name,
    birthName: 'DE VINCI',
    firstName: 'LEONARDO',
    gender: insi_person_class_1.Gender.Male,
    dateOfBirth: '2014-02-01',
});
exports.getDeVinciLeonardoXmlRequest = getDeVinciLeonardoXmlRequest;
//# sourceMappingURL=de-vinci-leonardo.fixture.js.map