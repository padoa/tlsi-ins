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
The script use environment variable by default (TLSI_INS_SOFTWARE_NAME, TLSI_INS_SOFTWARE_VERSION...) but you can modify some with the script options.
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
your certificate is: {
  pfx: <Buffer 30 82 1b ec 02 01 03 30 82 1b b2 06 09 2a 86 48 86 f7 0d 01 07 01 a0 82 1b a3 04 82 1b 9f 30 82 1b 9b 30 82 16 52 06 09 2a 86 48 86 f7 0d 01 07 01 a0 ... 7102 more bytes>,
  subjectCN: 'INSI-MANU',
  issuerCN: 'AC IGC-SANTE ELEMENTAIRE ORGANISATIONS',
  validity: {
    notBefore: 2023-11-08T15:39:16.000Z,
    notAfter: 2026-11-08T15:39:16.000Z
  }
}
------------------TEST TO CALL INS SERVER WITH THE CERTIFICATE AND A TEST USER------------------
{ CR: { CodeCR: '01', LibelleCR: 'Aucune identite trouvee' } }

------------------ALL IS GOOD, YOU CAN USE THE CERTIFICATE------------------
```

```sh
your certificate is: {
  pfx: <Buffer 30 82 1c 6d 02 01 03 30 82 1c 33 06 09 2a 86 48 86 f7 0d 01 07 01 a0 82 1c 24 04 82 1c 20 30 82 1c 1c 30 82 16 d3 06 09 2a 86 48 86 f7 0d 01 07 01 a0 ... 7231 more bytes>,
  subjectCN: 'INSI-MANU',
  issuerCN: 'TEST AC IGC-SANTE ELEMENTAIRE ORGANISATIONS',
  validity: {
    notBefore: 2021-12-01T15:18:56.000Z,
    notAfter: 2024-12-01T15:18:56.000Z
  }
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
