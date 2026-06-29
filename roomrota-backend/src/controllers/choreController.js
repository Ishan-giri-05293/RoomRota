const { admin, db } = require("../config/firebase");
const ApiError = require("../utils/ApiError");
const { optionalDate, requiredString } = require("../utils/validation");
const { selectAssignee } = require("../services/assignmentService");
const { logEvent } = require("../utils/eventLogger");

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
        assignedCount: admin.firestore.FieldValue.increment(1),
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

  await logEvent({
    flatId,
    type: "CHORE_CREATED",
    description: `created "${input.title}"`,
    userName: req.user.name,
    userId: req.user.uid,
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

  const snapshot = await query.limit(100).get();

  const chores = snapshot.docs.map((doc) => ({
    choreId: doc.id,
    ...doc.data(),
  }));

  chores.sort(
    (a, b) =>
      (b.createdAt?.toMillis?.() || 0) -
      (a.createdAt?.toMillis?.() || 0)
  );

  res.status(200).json(chores);
};

const completeChore = async (req, res) => {
  const choreRef = db.collection("chores").doc(req.params.choreId);
  const actorId = req.user.uid;

  let chore;

  await db.runTransaction(async (transaction) => {
    const choreDoc = await transaction.get(choreRef);

    if (!choreDoc.exists) {
      throw new ApiError(404, "Chore not found", "CHORE_NOT_FOUND");
    }

    chore = choreDoc.data();

    if (chore.completed) return;

    transaction.update(choreRef, {
      completed: true,
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
      completedBy: actorId,
    });

    if (chore.assignedTo) {
      const assignedRef = db.collection("users").doc(chore.assignedTo);

      transaction.update(assignedRef, {
        currentChoreCount: admin.firestore.FieldValue.increment(-1),
      });
    }

    // Give credit to the person who clicked the button
    const actorRef = db.collection("users").doc(actorId);

    transaction.update(actorRef, {
      completedCount: admin.firestore.FieldValue.increment(1),

      // Backward compatibility with old leaderboard
      score: admin.firestore.FieldValue.increment(1),
    });
  });

  const isHelper = chore.assignedTo && chore.assignedTo !== actorId;

  await logEvent({
    flatId: chore.flatId,
    type: "CHORE_COMPLETED",
    description: isHelper
      ? `completed a chore assigned to another member: "${chore.title}"`
      : `completed their assigned chore: "${chore.title}"`,
    userName: req.user.name,
    userId: actorId,
  });

  res.status(200).json({
    message: "Chore completed",
  });
};
const undoCompleteChore = async (req, res) => {
  const { choreId } = req.params;
  const actorId = req.user.uid;
  const choreRef = db.collection("chores").doc(choreId);

  let chore;

  await db.runTransaction(async (transaction) => {
    // --- STEP 1: READ PHASE ---
    const choreDoc = await transaction.get(choreRef);

    if (!choreDoc.exists) {
      throw new ApiError(404, "Chore not found", "CHORE_NOT_FOUND");
    }

    chore = choreDoc.data();

    // Must already be completed
    if (!chore.completed) {
      throw new ApiError(
        400,
        "Chore is not completed",
        "CHORE_NOT_COMPLETED"
      );
    }

    // Only the person who completed it can undo
    if (chore.completedBy !== actorId) {
      throw new ApiError(
        403,
        "Only the person who completed this chore can undo it",
        "FORBIDDEN"
      );
    }

    // Fetch the assigned user's doc NOW while we are still in the READ PHASE
    let assignedDoc = null;
    if (chore.assignedTo) {
      const assignedRef = db.collection("users").doc(chore.assignedTo);
      assignedDoc = await transaction.get(assignedRef);
    }

    // --- STEP 2: WRITE PHASE ---
    // Revert chore back to pending
    transaction.update(choreRef, {
      completed: false,
      completedAt: admin.firestore.FieldValue.delete(),
      completedBy: admin.firestore.FieldValue.delete(),
    });

    // Remove completion credit
    const actorRef = db.collection("users").doc(actorId);
    transaction.update(actorRef, {
      completedCount: admin.firestore.FieldValue.increment(-1),
      score: admin.firestore.FieldValue.increment(-1),
    });

    // Restore workload to original assignee using the doc we fetched earlier
    if (assignedDoc && assignedDoc.exists && assignedDoc.data().flatId === chore.flatId) {
      transaction.update(assignedDoc.ref, {
        currentChoreCount: admin.firestore.FieldValue.increment(1),
      });
    }
  });

  await logEvent({
    flatId: chore.flatId,
    type: "CHORE_UNDO",
    description: `reverted "${chore.title}" to pending`,
    userName: req.user.name,
    userId: actorId,
  });

  res.status(200).json({
    message: "Chore reverted to pending",
  });
};

const deleteChore = async (req, res) => {
  const { choreId } = req.params;
  const choreRef = db.collection("chores").doc(choreId);

  let chore;

  await db.runTransaction(async (transaction) => {
    const choreDoc = await transaction.get(choreRef);

    if (!choreDoc.exists) {
      throw new ApiError(404, "Chore not found", "CHORE_NOT_FOUND");
    }

    chore = choreDoc.data();

    await memberFlat(chore.flatId, req.user.uid);

    if (chore.assignedTo && !chore.completed) {
      const userRef = db.collection("users").doc(chore.assignedTo);

      transaction.update(userRef, {
        currentChoreCount: admin.firestore.FieldValue.increment(-1),
      });
    }

    transaction.delete(choreRef);
  });

  await logEvent({
    flatId: chore.flatId,
    type: "CHORE_DELETED",
    description: `deleted "${chore.title}"`,
    userName: req.user.name,
    userId: req.user.uid,
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
      assignedCount: admin.firestore.FieldValue.increment(1),
      lastAssignedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastChore: input.title,
    });

    return selected;
  });

  await logEvent({
    flatId,
    type: "SMART_ASSIGN",
    description: `AI assigned "${input.title}" to ${selectedUser.name}`,
    userName: "Robot",
    userId: "ai-system",
  });

  res.status(201).json({
    message: "Smart chore assigned",
    assignee: selectedUser,
    choreId: choreRef.id,
  });
};

const updateChore = async (req, res) => {
  const { choreId } = req.params;
  const { title, assignedTo } = req.body;

  const choreRef = db.collection("chores").doc(choreId);

  let chore;

  await db.runTransaction(async (transaction) => {
    const choreDoc = await transaction.get(choreRef);

    if (!choreDoc.exists) {
      throw new ApiError(404, "Chore not found", "CHORE_NOT_FOUND");
    }

    chore = choreDoc.data();

    if (chore.completed) {
      throw new ApiError(
        400,
        "Cannot edit a completed chore",
        "CHORE_ALREADY_COMPLETED"
      );
    }

    await memberFlat(chore.flatId, req.user.uid);

    const updates = {};

    if (title) {
      updates.title = requiredString(title, "title", {
        min: 2,
        max: 120,
      });
    }

    if (assignedTo !== undefined && assignedTo !== chore.assignedTo) {
      // Remove workload from old assignee
      if (chore.assignedTo) {
        const oldUserRef = db.collection("users").doc(chore.assignedTo);

        transaction.update(oldUserRef, {
          currentChoreCount: admin.firestore.FieldValue.increment(-1),
        });
      }

      // Add workload to new assignee
      if (assignedTo) {
        const newUserRef = db.collection("users").doc(assignedTo);

        transaction.update(newUserRef, {
          currentChoreCount: admin.firestore.FieldValue.increment(1),
          assignedCount: admin.firestore.FieldValue.increment(1),
          lastAssignedAt: admin.firestore.FieldValue.serverTimestamp(),
          lastChore: title || chore.title,
        });
      }

      updates.assignedTo = assignedTo;
    }

    transaction.update(choreRef, updates);
  });

  await logEvent({
    flatId: chore.flatId,
    type: "CHORE_UPDATED",
    description: `updated "${title || chore.title}"`,
    userName: req.user.name,
    userId: req.user.uid,
  });

  res.status(200).json({
    message: "Chore updated successfully",
  });
};
module.exports = {
  addChore,
  getFlatChores,
  completeChore,
  undoCompleteChore,
  deleteChore,
  autoAssignChore,
  updateChore,
};