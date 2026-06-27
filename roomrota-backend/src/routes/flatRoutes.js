const express = require("express");
const router = express.Router();

const {
  createFlat,
  joinFlat,
  leaveFlat,
  getFlatDetails,
  getLeaderboard,
} = require("../controllers/flatController");

const authenticate = require("../middleware/authenticate");
const asyncHandler = require("../utils/asyncHandler");

router.use(authenticate);

router.post("/create", asyncHandler(createFlat));
router.post("/join", asyncHandler(joinFlat));
router.post("/leave", asyncHandler(leaveFlat));

router.get("/leaderboard/:flatId", asyncHandler(getLeaderboard));
router.get("/:flatId", asyncHandler(getFlatDetails));

module.exports = router;