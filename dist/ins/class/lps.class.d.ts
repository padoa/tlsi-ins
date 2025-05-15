export interface LpsArgs {
    idam: string;
    version: string;
    name: string;
    id: string;
}
export interface LpsSoapHeader {
    IDAM: {
        attributes: {
            R: 4;
        };
        $value: string;
    };
    Version: string;
    Instance: string;
    Nom: string;
}
export declare class LPS {
    idam: string;
    softwareVersion: string;
    softwareName: string;
    id: string;
    constructor({ idam, version, name, id }: LpsArgs);
    getSoapHeaderAsJson(): LpsSoapHeader;
}
