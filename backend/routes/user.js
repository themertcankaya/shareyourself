const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getCurrentUser,
  updateUser,
  updatePassword,
} = require("../controllers/userController");

router.get("/profile", authMiddleware, getCurrentUser);
router.patch("/update-user", authMiddleware, updateUser);
router.patch("/update-password", authMiddleware, updatePassword);
module.exports = router;
