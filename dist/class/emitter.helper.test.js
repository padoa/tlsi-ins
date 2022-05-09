"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const emitter_helper_1 = require("./emitter.helper");
const env_1 = require("../models/env");
const assertionPsSecurity_fixture_1 = require("../fixtures/assertionPsSecurity.fixture");
describe('# Emitter Helper', () => {
    let pfx;
    beforeAll(() => {
        pfx = fs_1.default.readFileSync('certificates/INSI-AUTO/AUTO-certificate.p12');
    });
    test('should be able to get emitter from pfx', () => {
        const emitter = emitter_helper_1.EmitterHelper.getEmitterFromPfx(pfx, env_1.PASSPHRASE);
        expect(emitter).toEqual('0002 187512751');
    });
    test('should be able to get emitter from assertionPs', () => {
        const emitter = emitter_helper_1.EmitterHelper.getEmitterFromAssertionPs(assertionPsSecurity_fixture_1.assertionPs);
        expect(emitter).toEqual('00B6087510');
    });
    test('should throw error when getting emitter from pfx that doesnt exist', () => {
        expect(() => {
            emitter_helper_1.EmitterHelper.getEmitterFromPfx(Buffer.from(''), env_1.PASSPHRASE);
        }).toThrowError();
    });
    test('should throw error when getting emitter from assertionPs that doesnt exist', () => {
        expect(() => {
            emitter_helper_1.EmitterHelper.getEmitterFromAssertionPs('');
        }).toThrowError();
    });
});
//# sourceMappingURL=emitter.helper.test.js.map