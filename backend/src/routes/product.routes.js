const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const validateRequest = require("../middleware/validate.middleware");
const {
  getProducts,
  getProduct,
  createProduct,
  getManagerProducts,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require("../controllers/product.controller");
const {
  createProductSchema,
  updateProductSchema,
} = require("../validators/product.validator");
router.get("/my-products", authenticate, authorize("manager"), getMyProducts);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.get(
  "/manager/:id",
  authenticate,
  authorize("admin"),
  getManagerProducts,
);
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
router.get("/my-products", authenticate, authorize("manager"), getMyProducts);
router.delete("/:id", authenticate, authorize("admin"), deleteProduct);

module.exports = router;
