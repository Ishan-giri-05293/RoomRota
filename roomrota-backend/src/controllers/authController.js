const { admin, db } = require("../config/firebase");
const ApiError = require("../utils/ApiError");
const { emailAddress, password, requiredString } = require("../utils/validation");

const authenticateWithFirebase = async (operation, email, userPassword) => {
  const apiKey = process.env.FIREBASE_WEB_API_KEY;
  if (!apiKey) throw new Error("FIREBASE_WEB_API_KEY is not configured");

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:${operation}?key=${apiKey}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password: userPassword, returnSecureToken: true }),
    }
  );
  const data = await response.json();

  if (!response.ok) {
    const firebaseCode = data.error?.message || "AUTHENTICATION_FAILED";
    const conflicts = new Set(["EMAIL_EXISTS"]);
    const invalidCredentials = new Set([
      "EMAIL_NOT_FOUND",
      "INVALID_LOGIN_CREDENTIALS",
      "INVALID_PASSWORD",
      "USER_DISABLED",
    ]);

    if (conflicts.has(firebaseCode)) {
      throw new ApiError(409, "An account with this email already exists", "EMAIL_EXISTS");
    }
    if (invalidCredentials.has(firebaseCode)) {
      throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }
    throw new ApiError(400, "Firebase could not authenticate this request", firebaseCode);
  }

  return data;
};

const signup = async (req, res) => {
  const name = requiredString(req.body.name, "name", { min: 2, max: 80 });
  const email = emailAddress(req.body.email);
  const userPassword = password(req.body.password);
  const authResult = await authenticateWithFirebase("signUp", email, userPassword);

  try {
    await admin.auth().updateUser(authResult.localId, { displayName: name });
    await db.collection("users").doc(authResult.localId).set({
      uid: authResult.localId,
      name,
      email: authResult.email,
      flatId: null,
      isAvailable: true,
      currentChoreCount: 0,
      lastAssignedAt: null,
      lastChore: null,
      score: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    await admin.auth().deleteUser(authResult.localId).catch(() => {});
    throw error;
  }

  res.status(201).json({
    message: "User created successfully",
    token: authResult.idToken,
    refreshToken: authResult.refreshToken,
    expiresIn: Number(authResult.expiresIn),
    user: { uid: authResult.localId, name, email: authResult.email, flatId: null },
  });
};

const login = async (req, res) => {
  const email = emailAddress(req.body.email);
  const userPassword = password(req.body.password);
  const authResult = await authenticateWithFirebase("signInWithPassword", email, userPassword);
  const userDoc = await db.collection("users").doc(authResult.localId).get();

  if (!userDoc.exists) {
    throw new ApiError(409, "User profile is missing", "PROFILE_MISSING");
  }

  res.status(200).json({
    message: "Login successful",
    token: authResult.idToken,
    refreshToken: authResult.refreshToken,
    expiresIn: Number(authResult.expiresIn),
    user: userDoc.data(),
  });
};

const toggleAvailability = async (req, res) => {
  if (req.params.uid && req.params.uid !== req.user.uid) {
    throw new ApiError(403, "You can only change your own availability", "FORBIDDEN");
  }

  const userRef = db.collection("users").doc(req.user.uid);
  const isAvailable = await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists) throw new ApiError(404, "User not found", "USER_NOT_FOUND");

    const nextValue = userDoc.data().isAvailable === false;
    transaction.update(userRef, { isAvailable: nextValue });
    return nextValue;
  });

  res.status(200).json({ message: "Availability updated", isAvailable });
};

module.exports = {
  signup,
  login,
  toggleAvailability,
};
