const productService = require("../services/product.service");
const {
  getCache,
  setCache,
  deleteCache,
  invalidateProductsCache,
  PRODUCT_LIST_PREFIX,
  PRODUCT_DETAIL_PREFIX,
} = require("../services/cache.service");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");

exports.getProducts = asyncHandler(async (req, res) => {
  const cacheKey = PRODUCT_LIST_PREFIX + JSON.stringify(req.query);
  const cached = await getCache(cacheKey);

  if (cached) {
    console.log("[ROUTE] GET /api/products -> Cache HIT");
    res.set("X-Cache", "HIT");
    return res.json(cached);
  }

  console.log("[ROUTE] GET /api/products -> Cache MISS, fetching from DB");
  const products = await productService.getProducts(req.query);

  await setCache(cacheKey, products);

  res.set("X-Cache", "MISS");
  res.json(products);
});

exports.getProduct = asyncHandler(async (req, res) => {
  const cacheKey = PRODUCT_DETAIL_PREFIX + req.params.id;
  const cached = await getCache(cacheKey);

  if (cached) {
    console.log(`[ROUTE] GET /api/products/${req.params.id} -> Cache HIT`);
    res.set("X-Cache", "HIT");
    return res.json(cached);
  }

  console.log(
    `[ROUTE] GET /api/products/${req.params.id} -> Cache MISS, fetching from DB`,
  );
  const product = await productService.getProductById(req.params.id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  await setCache(cacheKey, product);

  res.set("X-Cache", "MISS");
  res.json(product);
});

exports.createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);

  await invalidateProductsCache();

  res.status(201).json(product);
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  await invalidateProductsCache();
  await deleteCache(PRODUCT_DETAIL_PREFIX + req.params.id);

  res.json(product);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await productService.deleteProduct(req.params.id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  await invalidateProductsCache();
  await deleteCache(PRODUCT_DETAIL_PREFIX + req.params.id);

  res.json({
    message: "Product deleted successfully",
  });
});
