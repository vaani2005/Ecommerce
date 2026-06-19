const { redisClient } = require("../config/redis");

const rateLimit = ({ windowSeconds = 60, maxRequests = 20 } = {}) => {
  return async (req, res, next) => {
    try {
      const key = `rate:${req.ip}:${req.path}`;
      const current = await redisClient.incr(key);

      if (current === 1) {
        await redisClient.expire(key, windowSeconds);
      }

      if (current > maxRequests) {
        return res.status(429).json({
          message: "Too many requests, please try again later.",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = rateLimit; // ✅ IMPORTANT CHANGE
