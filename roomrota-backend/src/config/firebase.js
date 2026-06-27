const admin = require("firebase-admin");

if (!admin.apps.length) {
  const options = {};

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (_error) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT must contain valid JSON");
    }
    options.credential = admin.credential.cert(serviceAccount);
  } else {
    options.credential = admin.credential.applicationDefault();
  }

  admin.initializeApp(options);
}

const db = admin.firestore();

module.exports = { admin, db };
