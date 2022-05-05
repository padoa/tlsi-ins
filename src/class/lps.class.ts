import { v4 as uuidv4 } from 'uuid';

export interface LpsArgs {
  idam: string;
  version: string;
  name: string;
  id: string; // UUID
}

export interface LpsSoapHeader {
  IDAM: {
    attributes: { R: 4 };
    $value: string;
  },
  Version: string;
  Instance: string; // UUID
  Nom: string;
}

export class LPS {
  public idam: string;
  public softwareVersion: string;
  public softwareName: string;
  public id: string; // UUID

  constructor(
    { idam, version, name , id }: LpsArgs,
  ) {
    if (!idam) {
      throw new Error('Fail to create a LPS, you must provide an idam');
    }
    this.idam = idam;
    if (!version) {
      throw new Error('Fail to create a LPS, you must provide a version');
    }
    this.softwareVersion = version;
    if (!name) {
      throw new Error('Fail to create a LPS, you must provide a name');
    }
    this.softwareName = `urn:lps:${name}:${version}`;
    this.id = id || uuidv4();
  }

  public getSoapHeaderAsJson(): LpsSoapHeader {
    return {
      IDAM: {
        attributes: { R: 4 },
        $value: this.idam,
      },
      Version: this.softwareVersion,
      Instance: this.id,
      Nom: this.softwareName,
    };
  }
}
