export interface ILPSData {
    idam: string;
    version: string;
    name: string;
}
export interface ILPSOptions {
    id?: string;
}
export interface ILpsSoapHeader {
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
    constructor({ idam, version, name }: ILPSData, { id }?: ILPSOptions);
    getSoapHeaderAsJson(): ILpsSoapHeader;
}
