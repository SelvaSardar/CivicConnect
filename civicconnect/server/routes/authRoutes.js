const express = require("express");

const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", protect, getMe);

router.get(
  "/admin-test",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Admin access granted",
    });
  }
);

router.get(
  "/staff-test",
  protect,
  authorizeRoles("staff", "admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Staff/Admin access granted",
    });
  }
);

module.exports = router;