const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const { validateRequest } = require("../middleware/validate.middleware");
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
} = require("../controllers/order.controller");
const {
  createOrderSchema,
  updateOrderStatusSchema,
} = require("../validators/order.validator");

router.post(
  "/",
  authenticate,
  authorize("customer"),
  validateRequest(createOrderSchema),
  createOrder,
);

router.get("/", authenticate, getOrders);
router.get("/:id", authenticate, getOrder);

router.patch(
  "/:id/status",
  authenticate,
  authorize("manager", "admin"),
  validateRequest(updateOrderStatusSchema),
  updateOrderStatus,
);

module.exports = router;
