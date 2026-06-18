const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  setRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
} = require("../services/refreshToken.service");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");

exports.register = asyncHandler(async (req, res) => {
  const data = req.body;

  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const user = await User.create(data);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const data = req.body;

  const user = await User.findOne({ email: data.email }).select("+password");

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isValid = await user.comparePassword(data.password);

  if (!isValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await setRefreshToken(user._id.toString(), refreshToken);

  res.json({
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      role: user.role,
    },
  });
});

exports.refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError("Refresh token required", 401);
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  const storedToken = await getRefreshToken(decoded.id);

  if (!storedToken || storedToken !== refreshToken) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError("User not found", 401);
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  await setRefreshToken(user._id.toString(), newRefreshToken);

  res.json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
});

exports.logout = asyncHandler(async (req, res) => {
  await deleteRefreshToken(req.user.id);

  res.json({
    message: "Logged out successfully",
  });
});
