const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

app.use(cors());

app.use(express.json());

app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({
    success: true,
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);
// Centralized error handler (should be last middleware)
app.use(errorHandler);
module.exports = app;
