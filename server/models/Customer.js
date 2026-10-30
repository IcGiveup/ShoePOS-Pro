const mongoose = require("mongoose");

const customerSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        validate: {
          validator: function (v) {
            return /^[A-Za-z\s]+$/.test(v);
          },
          message:
            "Name must contain only letters",
        },
      },

      phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
          validator: function (v) {
            return /^[0-9]{11}$/.test(v);
          },
          message:
            "Phone number must be exactly 11 digits",
        },
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
          validator: function (v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
              v
            );
          },
          message:
            "Invalid email address",
        },
      },

      points: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    { timestamps: true }
  );

module.exports =
  mongoose.model(
    "Customer",
    customerSchema
  );