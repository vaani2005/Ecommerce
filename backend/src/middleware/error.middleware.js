const { ZodError } = require("zod");
const AppError = require("../utils/AppError");

function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.errors,
    });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }

  if (err instanceof AppError) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  console.error(err);

  return res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
}

module.exports = errorHandler;
