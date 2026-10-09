const Complaint = require("../models/Complaint");

const createComplaint = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            location,
            image,
        } = req.body;

        // Validate required fields
        if (!title || !description || !category || !location?.address) {
            return res.status(400).json({
                success: false,
                message: "Title, description, category and location are required",
            });
        }

        // Create complaint
        const complaint = await Complaint.create({
            title: title.trim(),
            description: description.trim(),
            category,
            location: {
                address: location.address.trim(),
                latitude: location.latitude || null,
                longitude: location.longitude || null,
            },
            image: image || "",
            reportedBy: req.user.userId,
        });

        res.status(201).json({
            success: true,
            message: "Complaint submitted successfully",
            complaint,
        });
    } catch (error) {
        console.error("Create complaint error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error while creating complaint",
        });
    }
};

const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({
            reportedBy: req.user.userId,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            complaints,
        });
    } catch (error) {
        console.error("Get my complaints error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error while fetching complaints",
        });
    }
};

const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found",
            });
        }

        // Make sure the complaint belongs to the logged-in citizen
        if (complaint.reportedBy.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this complaint",
            });
        }

        res.status(200).json({
            success: true,
            complaint,
        });
    } catch (error) {
        console.error("Get complaint error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error while fetching complaint",
        });
    }
};

const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate("reportedBy", "name email phone")
            .populate("assignedTo", "name email phone")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            complaints,
        });
    } catch (error) {
        console.error("Get all complaints error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error while fetching complaints",
        });
    }
};

const assignComplaint = async (req, res) => {
    try {
        const { staffId } = req.body;

        if (!staffId) {
            return res.status(400).json({
                success: false,
                message: "Staff ID is required",
            });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found",
            });
        }

        const User = require("../models/User");

        const staff = await User.findOne({
            _id: staffId,
            role: "staff",
            isActive: true,
        });

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Active staff member not found",
            });
        }

        complaint.assignedTo = staff._id;
        complaint.status = "Assigned";

        await complaint.save();

        res.status(200).json({
            success: true,
            message: "Complaint assigned successfully",
            complaint,
        });
    } catch (error) {
        console.error("Assign complaint error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error while assigning complaint",
        });
    }
};

const updateComplaintStatus = async (req, res) => {
    try {
        const { status, resolutionNote } = req.body;

        const allowedStatuses = [
            "In Progress",
            "Resolved",
        ];

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required",
            });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status",
            });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found",
            });
        }

        if (
            !complaint.assignedTo ||
            complaint.assignedTo.toString() !== req.user.userId
        ) {
            return res.status(403).json({
                success: false,
                message: "This complaint is not assigned to you",
            });
        }

        complaint.status = status;

        if (status === "Resolved") {
            complaint.resolutionNote = resolutionNote?.trim() || "";
        }

        await complaint.save();

        res.status(200).json({
            success: true,
            message: "Complaint status updated successfully",
            complaint,
        });
    } catch (error) {
        console.error("Update complaint status error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error while updating complaint status",
        });
    }
};

module.exports = {
    createComplaint,
    getMyComplaints,
    getComplaintById,
    getAllComplaints,
    assignComplaint,
    updateComplaintStatus,

};