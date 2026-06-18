const { z } = require("zod");

const createProductSchema = z.object({
  name: z.string().min(2),

  description: z.string().optional(),

  category: z.string().min(1),

  price: z.coerce.number().positive(),

  stock: z.coerce.number().min(0),
});

const updateProductSchema = createProductSchema.partial();

module.exports = {
  createProductSchema,
  updateProductSchema,
};
