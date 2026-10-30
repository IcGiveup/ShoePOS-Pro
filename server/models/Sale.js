const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, unique: true },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },
    items: [
      {
        variantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Variant",
        },

        productName: String,
        size: String,
        color: String,

        qty: Number,

        price: Number,

        costPrice: Number, // REQUIRED

        lineTotal: Number,
      },
    ],
    subTotal: Number,
    discount: { type: Number, default: 0 },
    vat: { type: Number, default: 0 },
    total: Number,
    returnedAmount: {
      type: Number,
      default: 0,
    },

    returnedQty: {
      type: Number,
      default: 0,
    },
    payments: {
      cash: { type: Number, default: 0 },
      card: { type: Number, default: 0 },
      mobile: { type: Number, default: 0 },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Sale", saleSchema);
