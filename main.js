import fetch from 'node-fetch';
import forge from 'node-forge';
import fs from 'fs';
import https from 'https';
import { passPhrase }  from './certificats/passphrase.js';

const keyFile = fs.readFileSync("./certificats/asip-p12-EL-TEST-ORG-AUTH_CLI-20211115-103506.p12", 'binary');
const p12Asn1 = forge.asn1.fromDer(keyFile);
const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, passPhrase);

const cert = p12.getBags({ bagType: forge.pki.oids.certBag })[forge.pki.oids.certBag][0].cert;
const privateKey = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[forge.pki.oids.pkcs8ShroudedKeyBag][0].key;
const publicKey = cert.publicKey;

const publicKeyAsPem = forge.pki.publicKeyToPem(publicKey);
const privateKeyAsPem = forge.pki.privateKeyToPem(privateKey);
const certAsPem = forge.pki.certificateToPem(cert);

// https://stackoverflow.com/questions/32253909/curl-with-a-pkcs12-certificate-in-a-bash-script
console.log({
    publicKeyAsPem,
    privateKeyAsPem,
    certAsPem,
});

/*
openssl pkcs12 -in ./certificats/asip-p12-EL-TEST-ORG-AUTH_CLI-20211115-103506.p12 -out file.key.pem -nocerts -nodes
openssl pkcs12 -in ./certificats/asip-p12-EL-TEST-ORG-AUTH_CLI-20211115-103506.p12 -out file.crt.pem -clcerts -nokeys
Ts
*/

const agent = https.Agent({ cert: certAsPem, key: privateKeyAsPem });

fetch('https://qualiflps-services-ps-tlsm.ameli.fr/lps', { agent, method: 'POST' })
    .then((res) => {
        console.log('res', res);
    })
    .catch((reason) => {
        console.log('reason', reason);
    });
