const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth.middleware");
const rateLimit = require("../middleware/rateLimiter.middleware");
const validateRequest = require("../middleware/validate.middleware");
const {
  register,
  login,
  refresh,
  logout,
} = require("../controllers/auth.controller");
const {
  registerSchema,
  loginSchema,
  refreshSchema,
} = require("../validators/auth.validator");

router.post(
  "/register",
  rateLimit({ maxRequests: 10 }),
  validateRequest(registerSchema),
  register,
);

router.post(
  "/login",
  rateLimit({ maxRequests: 15 }),
  validateRequest(loginSchema),
  login,
);

router.post(
  "/refresh",
  rateLimit({ maxRequests: 20 }),
  validateRequest(refreshSchema),
  refresh,
);

router.post("/logout", authenticate, logout);

module.exports = router;
