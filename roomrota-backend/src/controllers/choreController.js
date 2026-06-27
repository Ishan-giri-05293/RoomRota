const { admin, db } = require("../config/firebase");
const ApiError = require("../utils/ApiError");
const { optionalDate, requiredString } = require("../utils/validation");
const { selectAssignee } = require("../services/assignmentService");

const choreInput = (body) => ({
  title: requiredString(body.title, "title", { min: 2, max: 120 }),
  difficulty: requiredString(body.difficulty || "medium", "difficulty", { max: 30 }),
  dueDate: optionalDate(body.dueDate),
});

const memberFlat = async (flatId, uid) => {
  const flatDoc = await db.collection("flats").doc(flatId).get();
  if (!flatDoc.exists) throw new ApiError(404, "Flat not found", "FLAT_NOT_FOUND");
  if (!flatDoc.data().members?.includes(uid)) {
    throw new ApiError(403, "You are not a member of this flat", "FORBIDDEN");
  }
  return flatDoc;
};

const addChore = async (req, res) => {
  const flatId = requiredString(req.body.flatId, "flatId", { max: 128 });
  const assignedTo = req.body.assignedTo
    ? requiredString(req.body.assignedTo, "assignedTo", { max: 128 })
    : null;
  const input = choreInput(req.body);
  const flatDoc = await memberFlat(flatId, req.user.uid);

  if (assignedTo && !flatDoc.data().members.includes(assignedTo)) {
    throw new ApiError(400, "Assignee must be a member of the flat", "INVALID_ASSIGNEE");
  }

  const choreRef = db.collection("chores").doc();
  await db.runTransaction(async (transaction) => {
    if (assignedTo) {
      const userRef = db.collection("users").doc(assignedTo);
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) throw new ApiError(400, "Assignee does not exist", "INVALID_ASSIGNEE");
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
      skipped: false,
      createdBy: req.user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  res.status(201).json({ message: "Chore added successfully", choreId: choreRef.id });
};

const getFlatChores = async (req, res) => {
  const { flatId } = req.params;
  await memberFlat(flatId, req.user.uid);
  const snapshot = await db.collection("chores").where("flatId", "==", flatId).limit(200).get();
  const chores = snapshot.docs
    .map((doc) => ({ choreId: doc.id, ...doc.data() }))
    .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
  res.status(200).json(chores);
};

const completeChore = async (req, res) => {
  const choreRef = db.collection("chores").doc(req.params.choreId);
  const result = await db.runTransaction(async (transaction) => {
    const choreDoc = await transaction.get(choreRef);
    if (!choreDoc.exists) throw new ApiError(404, "Chore not found", "CHORE_NOT_FOUND");

    const chore = choreDoc.data();
    const flatRef = db.collection("flats").doc(chore.flatId);
    const flatDoc = await transaction.get(flatRef);
    if (!flatDoc.exists || !flatDoc.data().members?.includes(req.user.uid)) {
      throw new ApiError(403, "You cannot complete this chore", "FORBIDDEN");
    }
    if (chore.completed) return { alreadyCompleted: true };

    let assigneeRef = null;
    let assigneeDoc = null;
    if (chore.assignedTo) {
      assigneeRef = db.collection("users").doc(chore.assignedTo);
      assigneeDoc = await transaction.get(assigneeRef);
    }

    transaction.update(choreRef, {
      completed: true,
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
      completedBy: req.user.uid,
    });

    if (assigneeDoc?.exists) {
      const user = assigneeDoc.data();
      transaction.update(assigneeRef, {
        score: (Number(user.score) || 0) + 1,
        currentChoreCount: Math.max(0, (Number(user.currentChoreCount) || 0) - 1),
      });
    }
    return { alreadyCompleted: false };
  });

  res.status(200).json({
    message: result.alreadyCompleted ? "Chore was already completed" : "Chore completed",
    alreadyCompleted: result.alreadyCompleted,
  });
};

const autoAssignChore = async (req, res) => {
  const flatId = requiredString(req.body.flatId, "flatId", { max: 128 });
  const input = choreInput(req.body);
  const choreRef = db.collection("chores").doc();

  const selectedUser = await db.runTransaction(async (transaction) => {
    const flatRef = db.collection("flats").doc(flatId);
    const flatDoc = await transaction.get(flatRef);
    if (!flatDoc.exists) throw new ApiError(404, "Flat not found", "FLAT_NOT_FOUND");

    const members = flatDoc.data().members || [];
    if (!members.includes(req.user.uid)) {
      throw new ApiError(403, "You are not a member of this flat", "FORBIDDEN");
    }

    const userRefs = members.map((uid) => db.collection("users").doc(uid));
    if (userRefs.length === 0) {
      throw new ApiError(409, "The flat has no members", "NO_FLAT_MEMBERS");
    }
    const userDocs = await transaction.getAll(...userRefs);
    const users = userDocs
      .filter((doc) => doc.exists)
      .map((doc) => ({ uid: doc.id, ...doc.data() }));
    const selected = selectAssignee(users, input.title);
    if (!selected) throw new ApiError(409, "No available users", "NO_AVAILABLE_USERS");

    const selectedRef = db.collection("users").doc(selected.uid);
    transaction.create(choreRef, {
      ...input,
      flatId,
      assignedTo: selected.uid,
      completed: false,
      skipped: false,
      createdBy: req.user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    transaction.update(selectedRef, {
      currentChoreCount: admin.firestore.FieldValue.increment(1),
      lastAssignedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastChore: input.title,
    });
    return { uid: selected.uid, name: selected.name };
  });

  res.status(201).json({
    message: "Smart chore assigned",
    assignedTo: selectedUser.uid,
    assignee: selectedUser,
    choreId: choreRef.id,
  });
};

module.exports = { addChore, getFlatChores, completeChore, autoAssignChore };
