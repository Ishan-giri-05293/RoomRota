const express = require("express");
const router = express.Router();

const {
  addChore,
  getFlatChores,
  completeChore,
  autoAssignChore,
} = require("../controllers/choreController");
const authenticate = require("../middleware/authenticate");
const asyncHandler = require("../utils/asyncHandler");

router.use(authenticate);
router.post("/add", asyncHandler(addChore));
router.get("/:flatId", asyncHandler(getFlatChores));
router.patch("/complete/:choreId", asyncHandler(completeChore));
router.post("/auto-assign", asyncHandler(autoAssignChore));

module.exports = router;
