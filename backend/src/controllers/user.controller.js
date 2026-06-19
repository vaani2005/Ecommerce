const userService = require("../services/user.service");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");

exports.getManagers = async (req, res) => {
  const managers = await userService.getManagers();

  res.json({
    success: true,
    data: managers,
  });
};

exports.getCustomers = async (req, res) => {
  const customers = await userService.getCustomers();

  res.json({
    success: true,
    data: customers,
  });
};
exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await User.findByIdAndDelete(id);

  res.json({
    success: true,
    message: "User deleted successfully",
  });
});
