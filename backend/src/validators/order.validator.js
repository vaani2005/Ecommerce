const { z } = require("zod");

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1, "Product ID is required"),
      quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    }),
    {
      errorMap: () => ({
        message: "At least one item is required in the order",
      }),
    },
  ),
});

const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "accepted", "rejected", "completed"], {
    errorMap: () => ({
      message:
        "Status must be one of: pending, accepted, rejected, or completed",
    }),
  }),
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
};
