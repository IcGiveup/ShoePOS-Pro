const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    size: {
      type: String,
      required: true,
    },

    color: {
      type: String,
      required: true,
    },

    costPrice: {
      type: Number,
      default: 0,
    },

    sku: {
      type: String,
      unique: true,
    },

    barcode: {
      type: String,
      unique: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Variant", variantSchema);
