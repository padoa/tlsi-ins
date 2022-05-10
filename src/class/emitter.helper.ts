import { util, asn1 , pkcs12, pki } from 'node-forge';

export class EmitterHelper {
  public static getEmitterFromPfx(pfx: Buffer, passphrase: string): string {
    let organizationalUnit;
    const p12Der = util.decode64(pfx.toString('base64'));
    const p12Asn1 = asn1.fromDer(p12Der);
    const p12 = pkcs12.pkcs12FromAsn1(p12Asn1, false, passphrase);
    const bags = p12.getBags({ bagType: pki.oids.certBag });
    const certBag = bags[pki.oids.certBag];
    if (!certBag) { throw new Error('Unable to find certBag'); }
    const { cert } = certBag[0];
    if (!cert) { throw new Error('Unable to find a cert in the certBag'); }
    organizationalUnit = cert.subject.getField('OU').value;
    return organizationalUnit;
  }

  public static getEmitterFromAssertionPs(assertionPs: string): string {
    const emitter = /(?<=">)([^<>]*?)(?=<\/NameID>)/.exec(assertionPs)?.[0];
    if (!emitter) {
      throw new Error(`Failed to get Emitter from assertion`);
    }
    return emitter;
  }
}
