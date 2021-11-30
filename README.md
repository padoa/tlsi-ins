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

echo TLSI_INS_CERTIFICATE_PASSPHRASE="The$ecretP@ssphrase" > .env
