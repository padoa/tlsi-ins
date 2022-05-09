import * as forge from 'node-forge';

export class EmitterHelper {
  public static getEmitterFromPfx(pfx: Buffer, passphrase: string): string {
    let organizationalUnit;
    try {
      const p12Der = forge.util.decode64(pfx.toString('base64'));
      const p12Asn1 = forge.asn1.fromDer(p12Der);
      const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, passphrase);
      const bags = p12.getBags({ bagType: forge.pki.oids.certBag });
      const certBag = bags[forge.pki.oids.certBag];
      if (!certBag) { throw 'Unable to find certBag'; }
      const { cert } = certBag[0];
      if (!cert) { throw 'Unable to find a cert in the certBag'; }
      organizationalUnit = cert.issuer.getField('OU').value;
    } catch (error) {
      throw new Error(`Failed to get Emitter from pfx: ${JSON.stringify(error)}` );
    }
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