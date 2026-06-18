const { z } = require("zod");

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.coerce.number().min(1),
    }),
  ),
});

const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "accepted", "rejected", "completed"]),
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
};
