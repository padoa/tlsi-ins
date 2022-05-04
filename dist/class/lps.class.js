"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LPS = void 0;
const uuid_1 = require("uuid");
class LPS {
    constructor({ idam, version, name }, { id } = {}) {
        if (!idam) {
            throw new Error('Fail to create a LPS, you must provide an idam');
        }
        this.idam = idam;
        if (!version) {
            throw new Error('Fail to create a LPS, you must provide a version');
        }
        this.softwareVersion = version;
        if (!name) {
            throw new Error('Fail to create a LPS, you must provide a name');
        }
        this.softwareName = `urn:lps:${name}:${version}`;
        this.id = id || (0, uuid_1.v4)();
    }
    getSoapHeaderAsJson() {
        return {
            IDAM: {
                attributes: { R: 4 },
                $value: this.idam,
            },
            Version: this.softwareVersion,
            Instance: this.id,
            Nom: this.softwareName,
        };
    }
}
exports.LPS = LPS;
//# sourceMappingURL=lps.class.js.map