"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsiError = void 0;
class InsiError extends Error {
    constructor({ originalError, requestId }) {
        super(originalError.body);
        this.requestId = requestId;
        this.originalError = originalError;
    }
}
exports.InsiError = InsiError;
//# sourceMappingURL=insi-error.js.map