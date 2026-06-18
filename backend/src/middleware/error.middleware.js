// const { ZodError } = require("zod");
// const AppError = require("../utils/AppError");

// function formatZodErrors(errors) {
//   const formatted = {};
//   errors.forEach((error) => {
//     const path = error.path.join(".");
//     if (!formatted[path]) {
//       formatted[path] = [];
//     }
//     formatted[path].push(error.message);
//   });
//   return formatted;
// }

// function errorHandler(err, req, res, next) {
//   if (err instanceof ZodError) {
//     const fieldErrors = formatZodErrors(err.errors);
//     return res.status(400).json({
//       success: false,
//       message: "Validation failed",
//       errors: fieldErrors,
//     });
//   }

//   if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token",
//     });
//   }

//   if (err instanceof AppError) {
//     return res.status(err.status).json({
//       success: false,
//       message: err.message,
//     });
//   }

//   console.error(err);

//   return res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// }

// module.exports = errorHandler;
const { ZodError } = require("zod");
const AppError = require("../utils/AppError");

function formatZodErrors(errors = []) {
  const formatted = {};

  errors.forEach((error) => {
    const path = error.path.join(".");

    if (!formatted[path]) {
      formatted[path] = [];
    }

    formatted[path].push(error.message);
  });

  return formatted;
}

function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",

      // CHANGE THIS LINE
      errors: formatZodErrors(err.issues),
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Email already exists",
      errors: {
        email: ["Email already exists"],
      },
    });
  }

  if (err.name === "ValidationError") {
    const errors = {};

    Object.keys(err.errors).forEach((key) => {
      errors[key] = [err.errors[key].message];
    });

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}

module.exports = errorHandler;
