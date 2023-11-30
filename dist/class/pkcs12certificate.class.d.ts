/// <reference types="node" />
interface IValidity {
    notBefore: Date;
    notAfter: Date;
}
export interface IPKCS12Certificate {
    pfx: Buffer;
    subjectCN: string;
    issuerCN: string;
    validity: IValidity;
}
export declare class PKCS12Certificate {
    static decryptCertificate(pfx: Buffer, passPhrase: string): IPKCS12Certificate;
    static validateINSCertificate(certificate: IPKCS12Certificate): void;
}
export {};
