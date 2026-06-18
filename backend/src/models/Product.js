const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

/*
Assignment Required Indexes
*/

productSchema.index({
  category: 1,
  price: 1,
});

productSchema.index({
  category: 1,
  createdAt: -1,
});

productSchema.index({
  name: 1,
});

productSchema.index({
  name: "text",
});

module.exports = mongoose.model("Product", productSchema);
