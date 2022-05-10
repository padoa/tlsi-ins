import fs from 'fs';
import { EmitterHelper } from './emitter.helper';
import { PASSPHRASE } from '../models/env';
import { assertionPs } from '../fixtures/assertionPsSecurity.fixture';

describe('# Emitter Helper', () => {
  let pfx: Buffer;

  beforeAll(() => {
    pfx = fs.readFileSync('certificates/INSI-AUTO/AUTO-certificate.p12');
  });

  test('should be able to get emitter from pfx', () => {
    const emitter = EmitterHelper.getEmitterFromPfx(pfx, PASSPHRASE);
    expect(emitter).toEqual('10B0152872');
  });

  test('should be able to get emitter from assertionPs', () => {
    const emitter = EmitterHelper.getEmitterFromAssertionPs(assertionPs);
    expect(emitter).toEqual('00B6087510');
  });

  test('should throw error when getting emitter from pfx that doesnt exist', () => {
    expect(() => {
      EmitterHelper.getEmitterFromPfx(Buffer.from(''), PASSPHRASE);
    }).toThrowError('Too few bytes to parse DER.');
  });

  test('should throw error when getting emitter from pfx with a wrong passphrase', () => {
    expect(() => {
      EmitterHelper.getEmitterFromPfx(pfx, 'wrong passphrase');
    }).toThrowError('PKCS#12 MAC could not be verified. Invalid password?');
  });

  test('should throw error when getting emitter from assertionPs that doesnt exist', () => {
    expect(() => {
      EmitterHelper.getEmitterFromAssertionPs('');
    }).toThrowError(`Failed to get Emitter from assertion`);
  });
});
