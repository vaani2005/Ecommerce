const orderService = require("../services/order.service");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");
const { invalidateProductsCache } = require("../services/cache.service");

exports.createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user.id, req.body.items);

  await invalidateProductsCache();

  res.status(201).json(order);
});

exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getOrders(req.user);
  res.json(orders);
});

exports.getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  res.json(order);
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await orderService.updateOrderStatus(id, status);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  res.json(order);
});
