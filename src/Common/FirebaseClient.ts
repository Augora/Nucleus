import { initializeApp, cert } from 'firebase-admin/app'

var serviceAccount: any = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECTID,
  private_key_id: process.env.FIREBASE_PRIVATEKEYID,
  private_key: process.env.FIREBASE_PRIVATEKEY,
  client_email: process.env.FIREBASE_CLIENTEMAIL,
  client_id: process.env.FIREBASE_CLIENTID,
  auth_uri: process.env.FIREBASE_AUTHURI,
  token_uri: process.env.FIREBASE_TOKENURI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTHPROVIDERX509CERTURL,
  client_x509_cert_url: process.env.FIREBASE_CLIENTX509CERTURL,
}

export default initializeApp({
  credential: cert(serviceAccount),
  databaseURL:
    'https://augora-f16f3-default-rtdb.europe-west1.firebasedatabase.app',
})
