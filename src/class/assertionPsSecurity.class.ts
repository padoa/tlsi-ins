import { ISecurity } from 'soap';
import https  from 'https';
import _ from 'lodash';

// Insert à string at a given position (return a new string)
function insertStr(stringToInsert: string, destination: string, position: number): string {
  return [destination.slice(0, position), stringToInsert, destination.slice(position)].join('');
}

const WSS_WSSECURITY_SECEXT = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd';

export class AssertionPsSecurityClass implements ISecurity {
  private assertionPs: string;
  private defaultOptions: https.AgentOptions;

  constructor(assertionPs: string, defaultOptions?: https.AgentOptions) {
    this.assertionPs = assertionPs;
    this.defaultOptions = {};
    _.merge(this.defaultOptions, defaultOptions);
  }

  public postProcess(xml: string, envelopeKey: string = 'soap') {
    const secHeader = `<wsse:Security xmlns:wsse="${WSS_WSSECURITY_SECEXT}">${this.assertionPs}</wsse:Security>`;
    return insertStr(secHeader, xml, xml.indexOf(`</${envelopeKey}:Header>`));
  }

  public addOptions(options: any): void {
    _.merge(options, this.defaultOptions);
    options.httpsAgent = new https.Agent(options);
  }
}
