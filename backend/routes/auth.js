const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  logout,
  getCurrentUser,
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

// Public route'lar
router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.get("/logout", logout);

// Protected route
router.get("/current-user", authMiddleware, getCurrentUser);

module.exports = router;
