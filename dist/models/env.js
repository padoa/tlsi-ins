"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOFTWARE_VERSION = exports.TLSI_INS_SOFTWARE_VERSION = exports.SOFTWARE_NAME = exports.TLSI_INS_SOFTWARE_NAME = exports.IDAM = exports.TLSI_INS_IDAM = exports.PASSPHRASE = exports.TLSI_INS_CERTIFICATE_PASSPHRASE = void 0;
const dotenv_1 = require("dotenv");
// Loads variables from the .env file
(0, dotenv_1.config)();
exports.TLSI_INS_CERTIFICATE_PASSPHRASE = process.env.TLSI_INS_CERTIFICATE_PASSPHRASE;
if (!exports.TLSI_INS_CERTIFICATE_PASSPHRASE)
    throw new Error('Please provide a TLSI_INS_CERTIFICATE_PASSPHRASE env variable');
exports.PASSPHRASE = exports.TLSI_INS_CERTIFICATE_PASSPHRASE;
exports.TLSI_INS_IDAM = process.env.TLSI_INS_IDAM;
if (!exports.TLSI_INS_IDAM)
    throw new Error('Please provide a TLSI_INS_IDAM env variable');
exports.IDAM = exports.TLSI_INS_IDAM;
exports.TLSI_INS_SOFTWARE_NAME = process.env.TLSI_INS_SOFTWARE_NAME;
if (!exports.TLSI_INS_SOFTWARE_NAME)
    throw new Error('Please provide a TLSI_INS_SOFTWARE_NAME env variable');
exports.SOFTWARE_NAME = exports.TLSI_INS_SOFTWARE_NAME;
exports.TLSI_INS_SOFTWARE_VERSION = process.env.TLSI_INS_SOFTWARE_VERSION;
if (!exports.TLSI_INS_SOFTWARE_VERSION)
    throw new Error('Please provide a TLSI_INS_SOFTWARE_VERSION env variable');
exports.SOFTWARE_VERSION = exports.TLSI_INS_SOFTWARE_VERSION;
//# sourceMappingURL=env.js.map