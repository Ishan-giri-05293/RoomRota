const admin = require("firebase-admin");
const path = require("path");

if (!admin.apps.length) {
  const options = {};

  // 1. Check if a JSON string is provided in ENV (useful for Heroku/Render)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      options.credential = admin.credential.cert(serviceAccount);
    } catch (_error) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT must contain valid JSON");
    }
  } 
  // 2. Otherwise, look for the serviceAccountKey.json file in the root
  else {
    try {
      // This looks for serviceAccountKey.json in the roomrota-backend folder
      const serviceAccountPath = path.join(__dirname, "../../serviceAccountKey.json");
      options.credential = admin.credential.cert(serviceAccountPath);
    } catch (error) {
      console.error("Firebase Admin initialization error:", error.message);
      // Fallback to default if file is missing
      options.credential = admin.credential.applicationDefault();
    }
  }

  admin.initializeApp(options);
}

const db = admin.firestore();

module.exports = { admin, db };