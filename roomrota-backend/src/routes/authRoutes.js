const express = require("express");
const router = express.Router();
const { signup, login, toggleAvailability } = require("../controllers/authController");
const authenticate = require("../middleware/authenticate");
const asyncHandler = require("../utils/asyncHandler");

router.post("/signup", asyncHandler(signup));
router.post("/login", asyncHandler(login));
router.patch("/availability", authenticate, asyncHandler(toggleAvailability));
router.patch("/availability/:uid", authenticate, asyncHandler(toggleAvailability));

module.exports = router;
