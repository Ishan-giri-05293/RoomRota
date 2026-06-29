const express = require("express");
const router = express.Router();

const {
  addChore,
  getFlatChores,
  completeChore,
  autoAssignChore,
  deleteChore,
  updateChore,
  undoCompleteChore,

} = require("../controllers/choreController");
const authenticate = require("../middleware/authenticate");
const asyncHandler = require("../utils/asyncHandler");

router.use(authenticate);
router.post("/add", asyncHandler(addChore));
router.get("/:flatId", asyncHandler(getFlatChores));
router.patch("/complete/:choreId", asyncHandler(completeChore));
router.patch("/:choreId", asyncHandler(updateChore)); // <--- Added
router.post("/auto-assign", asyncHandler(autoAssignChore));
router.delete("/:choreId", asyncHandler(deleteChore));
router.patch("/undo/:choreId", asyncHandler(undoCompleteChore));


module.exports = router;