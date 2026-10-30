const mongoose = require("mongoose");

const inventoryLogSchema = new mongoose.Schema(
  {
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
    },

    action: {
      type: String,
      enum: [
        "purchase",
        "sale",
        "return",
        "adjustment",
      ],
    },

    quantity: Number,

    previousStock: Number,

    newStock: Number,

    reason: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "InventoryLog",
  inventoryLogSchema
);