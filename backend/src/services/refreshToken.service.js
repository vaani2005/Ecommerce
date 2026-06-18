const { redisClient } = require("../config/redis");

const REFRESH_TOKEN_TTL =
  Number(process.env.REFRESH_TOKEN_TTL_SECONDS) || 7 * 24 * 60 * 60;

const setRefreshToken = async (userId, token) => {
  await redisClient.setEx(`refresh:${userId}`, REFRESH_TOKEN_TTL, token);
};

const getRefreshToken = async (userId) => {
  return await redisClient.get(`refresh:${userId}`);
};

const deleteRefreshToken = async (userId) => {
  await redisClient.del(`refresh:${userId}`);
};

module.exports = {
  setRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
};
