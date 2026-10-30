const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{10,15}$/, "Invalid phone number"]
    },

    company: {
      type: String,
      default: ""
    },

    email: {
      type: String,
      default: "",
      match: [
        /^\S+@\S+\.\S+$/,
        "Invalid email"
      ]
    },

    address: {
      type: String,
      default: ""
    },

    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Supplier",
  supplierSchema
);