const express = require("express");

const {
    createComplaint,
    getMyComplaints,
    getComplaintById,
    getAllComplaints,
    assignComplaint,
    updateComplaintStatus,
} = require("../controllers/complaintController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    authorizeRoles("citizen"),
    createComplaint
);

router.get(
    "/my",
    protect,
    authorizeRoles("citizen"),
    getMyComplaints
);

router.get(
    "/",
    protect,
    authorizeRoles("staff", "admin"),
    getAllComplaints
);

router.put(
    "/:id/assign",
    protect,
    authorizeRoles("admin"),
    assignComplaint
);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("staff"),
  updateComplaintStatus
);

router.get(
    "/:id",
    protect,
    authorizeRoles("citizen"),
    getComplaintById
);

module.exports = router;