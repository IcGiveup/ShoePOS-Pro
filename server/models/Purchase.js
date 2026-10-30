const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    grnNo: { type: String, unique: true },

    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true
    },

    items: [
      {
        variantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Variant"
        },
        productName: String,
        size: String,
        color: String,
        qty: Number,
        costPrice: Number,
        lineTotal: Number
      }
    ],

    totalCost: Number,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchase", purchaseSchema);