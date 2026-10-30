const Variant = require("../models/Variant");
const Sale = require("../models/Sale");
const Customer = require("../models/Customer");

exports.checkout = async (req, res) => {
  try {
    const {
      items,
      discount,
      vat,
      payments,
      customerId,
    } = req.body;

    let subTotal = 0;

    // =========================
    // VALIDATE STOCK + GET COST PRICE
    // =========================
    for (const item of items) {
      const variant = await Variant.findById(
        item.variantId
      );

      if (!variant) {
        return res.status(404).json({
          msg: "Product variant not found",
        });
      }

      if (variant.stock < item.qty) {
        return res.status(400).json({
          msg: "Insufficient stock",
        });
      }

      subTotal += item.qty * item.price;

      // Save cost price into sale item
      item.costPrice =
        variant.costPrice || 0;
    }

    // =========================
    // CALCULATE TOTALS
    // =========================
    const discountAmount =
      (subTotal *
        Number(discount || 0)) /
      100;

    const total =
      subTotal -
      discountAmount +
      Number(vat || 0);

    const paid =
      Number(payments.cash || 0) +
      Number(payments.card || 0) +
      Number(payments.mobile || 0);

    if (paid < total) {
      return res.status(400).json({
        msg: "Insufficient payment",
      });
    }

    // =========================
    // REDUCE STOCK
    // =========================
    for (const item of items) {
      await Variant.findByIdAndUpdate(
        item.variantId,
        {
          $inc: {
            stock: -item.qty,
          },
        }
      );
    }

    // =========================
    // CREATE SALE
    // =========================
    const invoiceNo =
      "INV-" +
      Date.now().toString().slice(-8);

    const sale = await Sale.create({
      invoiceNo,
      customerId:
        customerId || null,
      items,
      subTotal,
      discount: discountAmount,
      vat,
      total,
      payments,
      createdBy: req.user.id,
    });

    // =========================
    // CUSTOMER POINTS
    // =========================
    if (customerId) {
      const earned =
        Math.floor(total / 100);

      await Customer.findByIdAndUpdate(
        customerId,
        {
          $inc: {
            points: earned,
          },
        }
      );
    }

    res.status(201).json({
      msg: "Sale complete",
      sale,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: error.message,
    });
  }
};

exports.scanBarcode = async (req, res) => {
  try {
    const item =
      await Variant.findOne({
        barcode: req.params.barcode,
      }).populate("productId");

    if (!item) {
      return res.status(404).json({
        msg: "Item not found",
      });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};