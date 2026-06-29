const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const authenticate = require("../middleware/authenticate");
const asyncHandler = require("../utils/asyncHandler");

router.get("/:flatId", authenticate, asyncHandler(async (req, res) => {
  const { flatId } = req.params;
  
  // Broad query to avoid index requirement
  const snapshot = await db.collection("events")
    .where("flatId", "==", flatId)
    .limit(30)
    .get();

  const events = snapshot.docs.map(doc => ({ eventId: doc.id, ...doc.data() }));
  
  // Manual sort in memory
  events.sort((a, b) => (b.createdAt?._seconds || 0) - (a.createdAt?._seconds || 0));

  res.status(200).json(events);
}));

module.exports = router;