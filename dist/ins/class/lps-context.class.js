"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LpsContext = void 0;
const uuid_1 = require("uuid");
class LpsContext {
    constructor({ emitter, lps }) {
        if (!emitter) {
            throw new Error('Fail to create a LpsContext, you must provide an emitter');
        }
        this.emitter = emitter;
        if (!lps) {
            throw new Error('Fail to create a LpsContext, you must provide a lps');
        }
        this.lps = lps;
    }
    getSoapHeaderAsJson() {
        const soapHeader = {
            ContexteLPS: {
                attributes: {
                    Nature: 'CTXLPS',
                    Version: '01_00',
                },
                Id: (0, uuid_1.v4)(),
                Temps: new Date().toISOString(),
                Emetteur: this.emitter,
                LPS: this.lps.getSoapHeaderAsJson(),
            }
        };
        const name = 'ContexteLPS';
        const namespace = 'ctxlps';
        return { soapHeader, name, namespace };
    }
}
exports.LpsContext = LpsContext;
//# sourceMappingURL=lps-context.class.js.map