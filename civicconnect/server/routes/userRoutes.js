const express = require("express");

const {
  getStaffUsers,
  getAllUsers,
} = require("../controllers/userController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllUsers
);

router.get(
  "/staff",
  protect,
  authorizeRoles("admin"),
  getStaffUsers
);

module.exports = router;