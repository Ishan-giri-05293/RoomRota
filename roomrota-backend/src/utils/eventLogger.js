const { admin, db } = require("../config/firebase");

/**
 * Logs an event to Firestore as a best-effort side effect.
 * Failure to log will NOT throw an error or interrupt the primary action.
 */
const logEvent = async ({ flatId, type, description, userName, userId }) => {
  if (!flatId) return;

  try {
    const eventRef = db.collection("events").doc();
    await eventRef.set({
      flatId,
      type,
      description,
      userName: userName || "System",
      userId: userId || "system",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    // Log error to server console for internal tracking, but do not throw.
    console.error(`[Non-Critical] Failed to log event (${type}):`, error.message);
  }
};

module.exports = { logEvent };