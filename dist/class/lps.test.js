"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lps_class_1 = require("./lps.class");
describe('LPS class', () => {
    test('should be able to create an LPS and get his header as json', () => {
        const lps = new lps_class_1.LPS({
            idam: 'GDF1TNF51DK9',
            version: '2022',
            name: 'docto-solution',
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
    test('should not be able to create an LPS if id is unvalid', () => {
        expect(() => {
            new lps_class_1.LPS({
                idam: 'GDF1TNF51DK9',
                version: '2022',
                name: 'docto-solution',
                id: '',
            });
        }).toThrow('Fail to create a LPS, you must provide a valid id');
    });
    test('should not be able to create an LPS if empty IDAM', () => {
        expect(() => {
            new lps_class_1.LPS({
                idam: '',
                version: '2022',
                name: 'docto-solution',
                id: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
            });
        }).toThrow('Fail to create a LPS, you must provide an idam');
    });
    test('should not be able to create an LPS if empty version', () => {
        expect(() => {
            new lps_class_1.LPS({
                idam: 'GDF1TNF51DK9',
                version: '',
                name: 'docto-solution',
                id: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
            });
        }).toThrow('Fail to create a LPS, you must provide a version');
    });
    test('should not be able to create an LPS if empty name', () => {
        expect(() => {
            new lps_class_1.LPS({
                idam: 'GDF1TNF51DK9',
                version: '2022',
                name: '',
                id: 'b3549edd-4ae9-472a-b26f-fd2fb4ef397f',
            });
        }).toThrow('Fail to create a LPS, you must provide a name');
    });
});
//# sourceMappingURL=lps.test.js.map