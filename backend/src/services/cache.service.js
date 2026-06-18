const { redisClient } = require("../config/redis");

const PRODUCT_LIST_PREFIX = "products:";
const PRODUCT_DETAIL_PREFIX = "product:";
const TTL = 300;

exports.getCache = async (key) => {
  const data = await redisClient.get(key);

  if (data) {
    console.log(`[CACHE] HIT: ${key}`);
    return JSON.parse(data);
  }

  console.log(`[CACHE] MISS: ${key}`);
  return null;
};

exports.setCache = async (key, value) => {
  await redisClient.setEx(key, TTL, JSON.stringify(value));
  console.log(`[CACHE] SET: ${key} (TTL: ${TTL}s)`);
};

exports.deleteCache = async (key) => {
  await redisClient.del(key);
  console.log(`[CACHE] DELETE: ${key}`);
};

exports.invalidateProductsCache = async () => {
  const keys = await redisClient.keys(`${PRODUCT_LIST_PREFIX}*`);

  if (keys.length > 0) {
    await redisClient.del(keys);
    console.log(`[CACHE] INVALIDATED: ${keys.length} product list cache(s)`);
  }
};

exports.PRODUCT_LIST_PREFIX = PRODUCT_LIST_PREFIX;

exports.PRODUCT_DETAIL_PREFIX = PRODUCT_DETAIL_PREFIX;
