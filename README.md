# tlsi-ins

Téléservice INS en node

## Add certificates

You need certificates delivered by ANS, in order to access INS service.
Add the certificates certificates folder:

```
tlsi-ins
|-certificates
  |-asip-p12-EL-TEST-ORG-AUTH_CLI-20211115-1035506.p12
  |-asip-p12-EL-TEST-ORG-CONF-20211115-120501.p12
  |-asip-p12-EL-TEST-ORG-SIGN-20211115-110125.p12
```

You will need to provide the TLSI_INS_CERTIFICATE_PASSPHRASE env variable.
You can use the dotenv file:

```sh
echo TLSI_INS_CERTIFICATE_PASSPHRASE="The$ecretP@ssphrase" > .env
```

## Certificates

To show certificate info you can use:

```sh
openssl pkcs12 -info -in certificates/asip-p12-EL-TEST-ORG-AUTH_CLI-20211115-103506.p12
# Make sure to have the CN of your first certificate be INSI-MANU or INSI-AUTO or you might run into DESIR_560
# subject=/C=FR/ST=Rh\xC3\xB4ne (69)/O=CENTRE DE SANTE RPPS15287/OU=10B0152872/CN=Padoa
```

## Notes

> Pour l’erreur DESIR_560 - Niveau d'accès insuffisant : Si le CN de votre certificat Client est différent INSI-MANU ou INSI-AUTO, le serveur renvoi une erreur DESIR_560 avec le message « Vous ne disposez pas des droits suffisants pour accéder à ce service ». Le CN doit être égale à INSI-MANU ou INSI-AUTO et tous les caractères doivent être en majuscule et le séparateur entre INIS et AUTO est un signe moins -
> Pour vérifier le serveur du serveur, vous devez utiliser les AC « AC IGC-SANTE ELEMENTAIRE ORGANISATIONS » et AC RACINE IGC-SANTE ELEMENTAIRE. Ces 2 fichier d'AC sont disponibles à cette adresse : http://igc-sante.esante.gouv.fr/PC/
