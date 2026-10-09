const User = require("../models/User");

const getStaffUsers = async (req, res) => {
  try {
    const staffUsers = await User.find({
      role: "staff",
      isActive: true,
    })
      .select("name email phone role isActive")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: staffUsers.length,
      staff: staffUsers,
    });
  } catch (error) {
    console.error("Get staff users error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching staff users",
    });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email phone role isActive createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(
      "Get all users error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
};

module.exports = {
  getStaffUsers,
  getAllUsers,
};