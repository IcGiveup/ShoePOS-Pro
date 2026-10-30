const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // Product Name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Brand Name
    brand: {
      type: String,
      required: true,
      trim: true,
    },

    // Product Category
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // Base Price
    basePrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // Product Image
    image: {
      type: String,
      default: "",
    },

    // Description
    description: {
      type: String,
      default: "",
    },

    // Product Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Product",
  productSchema
);