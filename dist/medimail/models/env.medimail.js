"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MML_TEST_RECIPIENT_EMAIL = exports.MML_ACCOUNT_EMAIL = exports.MML_CERTIFICATE_PASSPHRASE = exports.PASSPHRASE = exports.TLSI_INS_CERTIFICATE_PASSPHRASE = void 0;
const dotenv_1 = require("dotenv");
// Loads variables from the .env file
// WARNING
// THIS FILE MUST NOT BE IMPORTED OUTSIDE TEST ENVIRONMENT
(0, dotenv_1.config)();
exports.TLSI_INS_CERTIFICATE_PASSPHRASE = process.env.TLSI_INS_CERTIFICATE_PASSPHRASE;
if (!exports.TLSI_INS_CERTIFICATE_PASSPHRASE)
    throw new Error('Please provide a TLSI_INS_CERTIFICATE_PASSPHRASE env variable');
exports.PASSPHRASE = exports.TLSI_INS_CERTIFICATE_PASSPHRASE;
const { MEDIMAIL_CERTIFICATE_PASSPHRASE } = process.env;
if (!MEDIMAIL_CERTIFICATE_PASSPHRASE)
    throw new Error('Please provide a MEDIMAIL_CERTIFICATE_PASSPHRASE env variable');
exports.MML_CERTIFICATE_PASSPHRASE = MEDIMAIL_CERTIFICATE_PASSPHRASE;
const { MEDIMAIL_ACCOUNT_EMAIL } = process.env;
if (!MEDIMAIL_ACCOUNT_EMAIL)
    throw new Error('Please provide a MEDIMAIL_ACCOUNT_EMAIL env variable');
exports.MML_ACCOUNT_EMAIL = MEDIMAIL_ACCOUNT_EMAIL;
const { MEDIMAIL_TEST_RECIPIENT_EMAIL } = process.env;
if (!MEDIMAIL_TEST_RECIPIENT_EMAIL)
    throw new Error('Please provide a MEDIMAIL_TEST_RECIPIENT_EMAIL env variable');
exports.MML_TEST_RECIPIENT_EMAIL = MEDIMAIL_TEST_RECIPIENT_EMAIL;
//# sourceMappingURL=env.medimail.js.map