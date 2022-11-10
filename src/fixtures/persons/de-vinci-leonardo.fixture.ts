import { getCNDAValidationXmlRequest } from '../insi-client.fixture';
import { Gender } from '../../class/insi-person.class';

export const getDeVinciLeonardoXmlRequest = ({ idam, version, name }: { idam: string, version: string, name: string }): string => getCNDAValidationXmlRequest({
  idam,
  version,
  name,
  birthName: 'DE VINCI',
  firstName: 'LEONARDO',
  gender: Gender.Male,
  dateOfBirth: '2014-02-01',
});
