import net from 'net';
import forge from 'node-forge';
import fs from 'fs';

const myServerCertificate = fs.readFileSync('./file.key.pem');
const myServerPrivateKey = fs.readFileSync('./file.crt.pem');

const socket = new net.Socket();
 
const client = forge.tls.createConnection({
  server: false,
  verify: function(connection, verified, depth, certs) {
    // skip verification for testing
    console.log('[tls] server certificate verified', { depth, certs });
    return true;
  },
  connected: function(connection) {
    console.log('[tls] connected');
    // prepare some data to send (note that the string is interpreted as
    // 'binary' encoded, which works for HTTP which only uses ASCII, use
    // forge.util.encodeUtf8(str) otherwise
    client.prepare('GET / HTTP/1.0\r\n\r\n');
  },
  getCertificate: function(connection, hint) {
    return myServerCertificate;
  },
  getPrivateKey: function(connection, cert) {
    return myServerPrivateKey;
  },
  tlsDataReady: function(connection) {
    // encrypted data is ready to be sent to the server
    const data = connection.tlsData.getBytes();
    socket.write(data, 'binary'); // encoding should be 'binary'
  },
  dataReady: function(connection) {
    // clear data from the server is ready
    const data = connection.data.getBytes();
    console.log('[tls] data received from the server: ' + data);
  },
  closed: function() {
    console.log('[tls] disconnected');
  },
  error: function(connection, error) {
    console.log('[tls] error', error);
  }
});
 
socket.on('connect', function() {
  console.log('[socket] connected');
  client.handshake();
});
socket.on('data', function(data) {
  client.process(data.toString('binary')); // encoding should be 'binary'
});
socket.on('end', function() {
  console.log('[socket] disconnected');
});
 
// connect to google.com
socket.connect(80, 'qualiflps-services-ps-tlsm.ameli.fr', function() {
  console.log('toto');
});