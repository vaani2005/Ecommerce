const { ZodError } = require("zod");

const validateRequest = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return next(error);
    }

    return next(error);
  }
};

module.exports = {
  validateRequest,
};
