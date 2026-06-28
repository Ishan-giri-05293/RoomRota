const { admin, db } = require("../config/firebase");
const ApiError = require("../utils/ApiError");
const { optionalDate, requiredString } = require("../utils/validation");
const { selectAssignee } = require("../services/assignmentService");

const choreInput = (body) => ({
  title: requiredString(body.title, "title", { min: 2, max: 120 }),
  difficulty: requiredString(body.difficulty || "medium", "difficulty", {
    max: 30,
  }),
  dueDate: optionalDate(body.dueDate),
});

const memberFlat = async (flatId, uid) => {
  const flatDoc = await db.collection("flats").doc(flatId).get();

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

  return flatDoc;
};

const addChore = async (req, res) => {
  const flatId = requiredString(req.body.flatId, "flatId", {
    max: 128,
  });

  const assignedTo = req.body.assignedTo || null;

  const input = choreInput(req.body);

  await memberFlat(flatId, req.user.uid);

  const choreRef = db.collection("chores").doc();

  await db.runTransaction(async (transaction) => {
    if (assignedTo) {
      const userRef = db.collection("users").doc(assignedTo);

      transaction.update(userRef, {
        currentChoreCount: admin.firestore.FieldValue.increment(1),
        lastAssignedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastChore: input.title,
      });
    }

    transaction.create(choreRef, {
      ...input,
      flatId,
      assignedTo,
      completed: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  res.status(201).json({
    message: "Chore added successfully",
    choreId: choreRef.id,
  });
};

const getFlatChores = async (req, res) => {
  const { flatId } = req.params;
  const { status } = req.query;

  await memberFlat(flatId, req.user.uid);

  let query = db.collection("chores").where("flatId", "==", flatId);

  if (status === "active") {
    query = query.where("completed", "==", false);
  } else if (status === "completed") {
    query = query.where("completed", "==", true);
  }

  // No Firestore composite index required
  const snapshot = await query.limit(100).get();

  const chores = snapshot.docs.map((doc) => ({
    choreId: doc.id,
    ...doc.data(),
  }));

  // Manual sorting
  chores.sort(
    (a, b) =>
      (b.createdAt?.toMillis?.() || 0) -
      (a.createdAt?.toMillis?.() || 0)
  );

  res.status(200).json(chores);
};

const completeChore = async (req, res) => {
  const choreRef = db.collection("chores").doc(req.params.choreId);

  await db.runTransaction(async (transaction) => {
    const choreDoc = await transaction.get(choreRef);

    if (!choreDoc.exists) {
      throw new ApiError(404, "Chore not found", "CHORE_NOT_FOUND");
    }

    const chore = choreDoc.data();

    if (chore.completed) return;

    transaction.update(choreRef, {
      completed: true,
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    if (chore.assignedTo) {
      const userRef = db.collection("users").doc(chore.assignedTo);

      transaction.update(userRef, {
        score: admin.firestore.FieldValue.increment(1),
        currentChoreCount: admin.firestore.FieldValue.increment(-1),
      });
    }
  });

  res.status(200).json({
    message: "Chore completed",
  });
};

const deleteChore = async (req, res) => {
  const { choreId } = req.params;
  const choreRef = db.collection("chores").doc(choreId);

  await db.runTransaction(async (transaction) => {
    const choreDoc = await transaction.get(choreRef);

    if (!choreDoc.exists) {
      throw new ApiError(404, "Chore not found", "CHORE_NOT_FOUND");
    }

    const chore = choreDoc.data();

    await memberFlat(chore.flatId, req.user.uid);

    if (chore.assignedTo && !chore.completed) {
      const userRef = db.collection("users").doc(chore.assignedTo);

      transaction.update(userRef, {
        currentChoreCount: admin.firestore.FieldValue.increment(-1),
      });
    }

    transaction.delete(choreRef);
  });

  res.status(200).json({
    message: "Chore deleted successfully",
  });
};
const autoAssignChore = async (req, res) => {
  const flatId = requiredString(req.body.flatId, "flatId", {
    max: 128,
  });

  const input = choreInput(req.body);
  const choreRef = db.collection("chores").doc();

  const selectedUser = await db.runTransaction(async (transaction) => {
    const flatRef = db.collection("flats").doc(flatId);
    const flatDoc = await transaction.get(flatRef);

    if (!flatDoc.exists) {
      throw new ApiError(404, "Flat not found", "FLAT_NOT_FOUND");
    }

    const members = flatDoc.data().members || [];

    if (!members.includes(req.user.uid)) {
      throw new ApiError(
        403,
        "You are not a member of this flat",
        "FORBIDDEN"
      );
    }

    const userRefs = members.map((uid) =>
      db.collection("users").doc(uid)
    );

    if (userRefs.length === 0) {
      throw new ApiError(
        409,
        "The flat has no members",
        "NO_FLAT_MEMBERS"
      );
    }

    const userDocs = await transaction.getAll(...userRefs);

    const users = userDocs
      .filter((doc) => doc.exists)
      .map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));

    const selected = selectAssignee(users, input.title);

    if (!selected) {
      throw new ApiError(
        409,
        "No available users",
        "NO_AVAILABLE_USERS"
      );
    }

    const selectedRef = db.collection("users").doc(selected.uid);

    transaction.create(choreRef, {
      ...input,
      flatId,
      assignedTo: selected.uid,
      completed: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    transaction.update(selectedRef, {
      currentChoreCount: admin.firestore.FieldValue.increment(1),
      lastAssignedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastChore: input.title,
    });

    return selected;
  });

  res.status(201).json({
    message: "Smart chore assigned",
    assignee: selectedUser,
    choreId: choreRef.id,
  });
};

module.exports = {
  addChore,
  getFlatChores,
  completeChore,
  deleteChore,
  autoAssignChore,
};