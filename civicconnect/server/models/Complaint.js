const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Complaint title is required"],
      trim: true,
      minlength: 5,
      maxlength: 100,
    },

    description: {
      type: String,
      required: [true, "Complaint description is required"],
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },

    category: {
      type: String,
      required: [true, "Complaint category is required"],
      enum: [
        "Road",
        "Street Light",
        "Garbage",
        "Water",
        "Drainage",
        "Electricity",
        "Public Safety",
        "Other",
      ],
    },

    location: {
      address: {
        type: String,
        required: [true, "Location is required"],
        trim: true,
      },

      latitude: {
        type: Number,
      },

      longitude: {
        type: Number,
      },
    },

    image: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Assigned",
        "In Progress",
        "Resolved",
        "Rejected",
      ],
      default: "Pending",
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    resolutionNote: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;