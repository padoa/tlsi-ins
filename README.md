# tlsi-ins

Téléservice INS en node

## Add certificates

You need certificates delivered by ANS, in order to access INS service.
Add the certificates certificates folder:

```
tlsi-ins
|-certificates
  |-INSI-AUTO/AUTO-certificate.p12
  |-INSI-MANU/MANU-certificate.p12
```

You will need to provide the TLSI_INS_CERTIFICATE_PASSPHRASE env variable.
You can use a dotenv file next to the package.json file (in the root folder):

```sh
echo TLSI_INS_CERTIFICATE_PASSPHRASE="The$ecretP@ssphrase" > .env
```

## Certificates

To show certificate info you can use:

```sh
openssl pkcs12 -info -in certificates/INSI-AUTO/AUTO-certificate.p12
# Make sure to have the CN of your first certificate be INSI-MANU or INSI-AUTO or you might run into DESIR_560
# subject=/C=FR/ST=Rh\xC3\xB4ne (69)/O=CENTRE DE SANTE RPPS15287/OU=10B0152872/CN=Padoa
```

## Script
#### test certificate
The script use environment variable by default (TLSI_INS_SOFTWARE_NAME, TLSI_INS_SOFTWARE_VERSION & TLSI_INS_IDAM) but you can use a personalized idam with the parameters of the script.
To run the script, execute

```sh
npm run verify-certif -- --certificatePath='certificate path' --passPhrase='certificate passphrase' --isTestCertif=false --idam='idam'
Options :
  -h, --help                   print help                              [boolean]
      --certificatePath        The path to the p12 certificate file to test
                                                             [string] [required]
      --passPhrase             The passphrase of the certificate to test
                                                             [string] [required]
      --isTestCertif           It must be true if it's a test certificate
                                                                       [boolean]
      --idam                   Use a different IDAM than the one in the
                               environment                              [string]
```

Exemples of return :

```sh
{
  certificateValidity: 'VALID',
  assertions: [
    {
      type: 'SUBJECT CN',
      status: 'SUCCESS',
      message: "Subjec's common name = INSI-MANU"
    },
    {
      type: 'ISSUER CN',
      status: 'SUCCESS',
      message: "Issuer's common name = AC IGC-SANTE ELEMENTAIRE ORGANISATIONS"
    },
    {
      type: 'VALIDITY DATES',
      status: 'SUCCESS',
      message: 'validity = {"notBefore":"2023-11-08T15:39:16.000Z","notAfter":"2026-11-08T15:39:16.000Z"}'
    }
  ]
}
------------------TEST TO CALL INS SERVER WITH THE CERTIFICATE AND A TEST USER------------------
{ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' } }

------------------ALL IS GOOD, YOU CAN USE THE CERTIFICATE------------------
```

```sh
{
  certificateValidity: 'VALID',
  assertions: [
    {
      type: 'SUBJECT CN',
      status: 'SUCCESS',
      message: "Subjec's common name = INSI-MANU"
    },
    {
      type: 'ISSUER CN',
      status: 'SUCCESS',
      message: "Issuer's common name = TEST AC IGC-SANTE ELEMENTAIRE ORGANISATIONS"
    },
    {
      type: 'VALIDITY DATES',
      status: 'SUCCESS',
      message: 'validity = {"notBefore":"2021-12-01T15:18:56.000Z","notAfter":"2024-12-01T15:18:56.000Z"}'
    }
  ]
}
------------------TEST TO CALL INS SERVER WITH THE CERTIFICATE AND A TEST USER------------------
{
  CR: { CodeCR: '00', LibelleCR: 'OK' },
  INDIVIDU: {
    INSACTIF: { IdIndividu: [Object], OID: '0.0.000.0.000.0.0.0' },
    TIQ: {
      NomNaissance: 'ADRUN',
      ListePrenom: 'ZOE',
      Sexe: 'F',
      DateNaissance: '1975-12-31',
      LieuNaissance: '63220'
    }
  }
}

------------------ALL IS GOOD, YOU CAN USE THE CERTIFICATE------------------
```

## Notes

> Pour l’erreur DESIR_560 - Niveau d'accès insuffisant : Si le CN de votre certificat Client est différent INSI-MANU ou INSI-AUTO, le serveur renvoi une erreur DESIR_560 avec le message « Vous ne disposez pas des droits suffisants pour accéder à ce service ». Le CN doit être égale à INSI-MANU ou INSI-AUTO et tous les caractères doivent être en majuscule et le séparateur entre INIS et AUTO est un signe moins -
> Pour vérifier le serveur du serveur, vous devez utiliser les AC « AC IGC-SANTE ELEMENTAIRE ORGANISATIONS » et AC RACINE IGC-SANTE ELEMENTAIRE. Ces 2 fichier d'AC sont disponibles à cette adresse : http://igc-sante.esante.gouv.fr/PC/
