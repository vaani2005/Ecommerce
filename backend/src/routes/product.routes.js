const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const { validateRequest } = require("../middleware/validate.middleware");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const {
  createProductSchema,
  updateProductSchema,
} = require("../validators/product.validator");

router.get("/", getProducts);
router.get("/:id", getProduct);

router.post(
  "/",
  authenticate,
  authorize("admin", "manager"),
  validateRequest(createProductSchema),
  createProduct,
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin", "manager"),
  validateRequest(updateProductSchema),
  updateProduct,
);

router.delete("/:id", authenticate, authorize("admin"), deleteProduct);

module.exports = router;
