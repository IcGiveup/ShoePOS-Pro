const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema(
  {
    saleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sale",
    },

    invoiceNo: String,

    type: {
      type: String,
      enum: ["return", "exchange"],
      default: "return",
    },

    oldVariantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
    },

    newVariantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
    },

    qty: Number,
    refundAmount: Number,
    extraPay: Number,
    reason: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Return",
  returnSchema
);