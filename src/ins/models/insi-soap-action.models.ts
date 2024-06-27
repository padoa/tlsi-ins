export enum INSiSoapActionsName {
  FETCH_FROM_IDENTITY_TRAITS = "FETCH_FROM_IDENTITY_TRAITS",
}

export const INSiSoapActions = {
  [INSiSoapActionsName.FETCH_FROM_IDENTITY_TRAITS]: {
    header: { Action: 'urn:ServiceIdentiteCertifiee:1.0.0:rechercherInsAvecTraitsIdentite' },
    method: 'rechercherInsAvecTraitsIdentite',
  },
}
