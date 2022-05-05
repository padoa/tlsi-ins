"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BamContext = void 0;
const uuid_1 = require("uuid");
class BamContext {
    constructor({ emitter }) {
        if (!emitter) {
            throw new Error('Fail to create a BamContext, you must provide an emitter');
        }
        this.emitter = emitter;
    }
    getSoapHeaderAsJson() {
        const soapHeader = {
            ContexteBAM: {
                attributes: {
                    Version: '01_02',
                },
                Id: (0, uuid_1.v4)(),
                Temps: new Date().toISOString(),
                Emetteur: this.emitter,
                COUVERTURE: {},
            },
        };
        const name = 'ContexteBAM';
        const namespace = 'ctxbam';
        return { soapHeader, name, namespace };
    }
}
exports.BamContext = BamContext;
//# sourceMappingURL=bam-context.class.js.map