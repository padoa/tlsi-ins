"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BamContext = void 0;
const uuid_1 = require("uuid");
class BamContext {
    constructor({ emitter }, { id, dateTime } = {}) {
        if (!emitter) {
            throw new Error('Fail to create a BamContext, you must provide an emitter');
        }
        this.emitter = emitter;
        this.id = id || (0, uuid_1.v4)();
        this.dateTime = dateTime || new Date().toISOString();
    }
    getSoapHeaderAsJson() {
        const soapHeader = {
            ContexteBAM: {
                attributes: {
                    Version: '01_02',
                },
                Id: this.id,
                Temps: this.dateTime,
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