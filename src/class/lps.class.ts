import { v4 as uuidv4 } from 'uuid';

export interface ILPSData {
  idam: string;
  version: string;
  name: string;
}

export interface ILpsSoapHeader {
  IDAM: {
    attributes: { R: 4 };
    $value: string;
  },
  Version: string;
  Instance: string;
  Nom: string;
}

export class LPS {
  public idam: string;
  public softwareVersion: string;
  public softwareName: string;
  public instance: string; // UUID

  constructor({ idam, version, name }: ILPSData) {
    this.idam = idam;
    this.softwareVersion = version;
    this.softwareName = name;
    this.instance = uuidv4();
  }

  public getSoapHeader(): ILpsSoapHeader {
    return {
      IDAM: {
        attributes: { R: 4 },
        $value: this.idam,
      },
      Version: this.softwareVersion,
      Instance: this.instance,
      Nom: this.softwareName,
    };
  }
}
