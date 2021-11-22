# tlsi-ins
Téléservice INS en node

## Add certificats
You need certificats delivered by ANS, in order to access INS service. 
You can find this certificats in the 1Password Prévisit.
Add the certificats and the passPhrase in a certificats folder :
```
tlsi-ins
|-certificats
  |-asip-p12-EL-TEST-ORG-AUTH_CLI-20211115-1035506.p12
  |-asip-p12-EL-TEST-ORG-CONF-20211115-120501.p12
  |-asip-p12-EL-TEST-ORG-SIGN-20211115-110125.p12
  |-passphrase.js
```

`passPhrase.js` should contains :
```
export const passPhrase = 'THE_PASS_PHRASE';
```
