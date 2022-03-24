"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bam_context_class_1 = require("./bam-context.class");
const uuid_1 = require("uuid");
describe('BAM Context', () => {
    test('should be able to create a BAM Context and get his header as json', () => {
        const bamContext = new bam_context_class_1.BamContext({
            emitter: 'medecin@yopmail.com',
        }, {
            id: '1f7425e2-b913-415c-adaa-785ee1076a70',
            dateTime: '2021-07-05T13:58:27.452Z',
        });
        const { soapHeader, name, namespace } = bamContext.getSoapHeaderAsJson();
        expect(name).toEqual('ContexteBAM');
        expect(namespace).toEqual('ctxbam');
        expect(soapHeader).toEqual({
            ContexteBAM: {
                attributes: {
                    Version: '01_02',
                },
                Id: '1f7425e2-b913-415c-adaa-785ee1076a70',
                Temps: '2021-07-05T13:58:27.452Z',
                Emetteur: 'medecin@yopmail.com',
                COUVERTURE: {},
            },
        });
    });
    test('should generate a valid UUID as id', () => {
        const myBamContext = new bam_context_class_1.BamContext({ emitter: 'medecin@yopmail.com' });
        expect((0, uuid_1.validate)(myBamContext.id));
    });
    test('should generate dateTime in ISO Format', () => {
        const myBamContext = new bam_context_class_1.BamContext({ emitter: 'medecin@yopmail.com' });
        expect(new Date(myBamContext.dateTime).toISOString()).toEqual(myBamContext.dateTime);
    });
    test('should not be able to create an Bam Context if empty emitter', () => {
        expect(() => {
            new bam_context_class_1.BamContext({ emitter: '' });
        }).toThrow('Fail to create a BamContext, you must provide an emitter');
    });
});
//# sourceMappingURL=bam-context.test.js.map