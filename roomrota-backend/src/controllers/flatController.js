const crypto = require("crypto");
const { admin, db } = require("../config/firebase");
const ApiError = require("../utils/ApiError");
const { requiredString } = require("../utils/validation");
const { logEvent } = require("../utils/eventLogger");

const createInviteCode = () =>
  crypto.randomBytes(6).toString("base64url").toUpperCase();

const uniqueInviteCode = async () => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = createInviteCode();

    const match = await db
      .collection("flats")
      .where("inviteCode", "==", code)
      .limit(1)
      .get();

    if (match.empty) return code;
  }

  throw new Error("Unable to generate a unique invite code");
};

const assertMember = (flatDoc, uid) => {
  if (!flatDoc.exists) {
    throw new ApiError(404, "Flat not found", "FLAT_NOT_FOUND");
  }

  if (!flatDoc.data().members?.includes(uid)) {
    throw new ApiError(
      403,
      "You are not a member of this flat",
      "FORBIDDEN"
    );
  }
};

const createFlat = async (req, res) => {
  const flatName = requiredString(req.body.flatName, "flatName", {
    min: 2,
    max: 80,
  });

  const uid = req.user.uid;
  const inviteCode = await uniqueInviteCode();

  const flatRef = db.collection("flats").doc();
  const userRef = db.collection("users").doc(uid);

  await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);

    if (!userDoc.exists) {
      throw new ApiError(404, "User not found", "USER_NOT_FOUND");
    }

    if (userDoc.data().flatId) {
      throw new ApiError(
        409,
        "User already belongs to a flat",
        "ALREADY_IN_FLAT"
      );
    }

    transaction.create(flatRef, {
      flatName,
      inviteCode,
      members: [uid],
      createdBy: uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    transaction.update(userRef, {
      flatId: flatRef.id,
    });
  });

  res.status(201).json({
    message: "Flat created successfully",
    flatId: flatRef.id,
    inviteCode,
  });
};

const joinFlat = async (req, res) => {
  const inviteCode = requiredString(req.body.inviteCode, "inviteCode", {
    min: 6,
    max: 20,
  }).toUpperCase();

  const uid = req.user.uid;

  const snapshot = await db
    .collection("flats")
    .where("inviteCode", "==", inviteCode)
    .limit(1)
    .get();

  if (snapshot.empty) {
    throw new ApiError(
      404,
      "Invalid invite code",
      "INVALID_INVITE_CODE"
    );
  }

  const flatRef = snapshot.docs[0].ref;
  const userRef = db.collection("users").doc(uid);

  await db.runTransaction(async (transaction) => {
    const [flatDoc, userDoc] = await transaction.getAll(flatRef, userRef);

    if (!flatDoc.exists) {
      throw new ApiError(404, "Flat not found", "FLAT_NOT_FOUND");
    }

    if (!userDoc.exists) {
      throw new ApiError(404, "User not found", "USER_NOT_FOUND");
    }

    const currentFlatId = userDoc.data().flatId;

    if (currentFlatId === flatRef.id) {
      throw new ApiError(
        409,
        "User already belongs to this flat",
        "ALREADY_IN_FLAT"
      );
    }

    if (currentFlatId) {
      throw new ApiError(
        409,
        "Leave the current flat before joining another",
        "ALREADY_IN_FLAT"
      );
    }

    transaction.update(flatRef, {
      members: admin.firestore.FieldValue.arrayUnion(uid),
    });

    transaction.update(userRef, {
      flatId: flatRef.id,
    });
  });

  await logEvent({
    flatId: flatRef.id,
    type: "MEMBER_JOINED",
    description: "joined the flat",
    userName: req.user.name,
    userId: req.user.uid,
  });

  res.status(200).json({
    message: "Joined flat successfully",
    flatId: flatRef.id,
  });
};

const getFlatDetails = async (req, res) => {
  const flatDoc = await db
    .collection("flats")
    .doc(req.params.flatId)
    .get();

  assertMember(flatDoc, req.user.uid);

  const { inviteCode, ...flat } = flatDoc.data();

  res.status(200).json({
    flatId: flatDoc.id,
    ...flat,
    inviteCode,
  });
};

const getLeaderboard = async (req, res) => {
  const flatRef = db.collection("flats").doc(req.params.flatId);
  const flatDoc = await flatRef.get();

  assertMember(flatDoc, req.user.uid);

  const userDocs = await db.getAll(
    ...flatDoc.data().members.map((uid) =>
      db.collection("users").doc(uid)
    )
  );

  const leaderboard = userDocs
    .filter((doc) => doc.exists)
    .map((doc) => {
      const user = doc.data();

      return {
        uid: doc.id,
        name: user.name,

        // Backwards compatibility:
        // New users use completedCount.
        // Old users still use score.
        completedCount: Number(user.completedCount ?? user.score ?? 0),

        assignedCount: Number(user.assignedCount || 0),
        currentChoreCount: Number(user.currentChoreCount || 0),

        isAvailable: user.isAvailable !== false,
      };
    })
    .sort(
      (a, b) =>
        b.completedCount - a.completedCount ||
        a.name.localeCompare(b.name)
    );

  res.status(200).json(leaderboard);
};
const leaveFlat = async (req, res) => {
  const uid = req.user.uid;
  const userRef = db.collection("users").doc(uid);

  let flatId;

  await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);

    if (!userDoc.exists) {
      throw new ApiError(404, "User not found", "USER_NOT_FOUND");
    }

    flatId = userDoc.data().flatId;

    if (!flatId) {
      throw new ApiError(
        400,
        "User is not currently in a flat",
        "NOT_IN_FLAT"
      );
    }

    const flatRef = db.collection("flats").doc(flatId);
    const flatDoc = await transaction.get(flatRef);

    // Clear user's flat
    transaction.update(userRef, {
      flatId: null,
    });

    // Remove user from flat members
    if (flatDoc.exists) {
      transaction.update(flatRef, {
        members: admin.firestore.FieldValue.arrayRemove(uid),
      });
    }
  });

  await logEvent({
    flatId,
    type: "MEMBER_LEFT",
    description: "left the flat",
    userName: req.user.name,
    userId: req.user.uid,
  });

  res.status(200).json({
    message: "Left flat successfully",
  });
};

module.exports = {
  createFlat,
  joinFlat,
  getFlatDetails,
  getLeaderboard,
  assertMember,
  leaveFlat,
};