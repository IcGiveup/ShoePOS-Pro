const Sale = require("../models/Sale");
const Variant = require("../models/Variant");
const Return = require("../models/Return");

exports.searchInvoice = async (req, res) => {
  try {
    const sale = await Sale.findOne({
      invoiceNo: req.params.invoiceNo,
    });

    if (!sale) {
      return res.status(404).json({
        msg: "Invoice not found",
      });
    }

    res.json(sale);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.processReturn = async (req, res) => {
  try {
    const { saleId, invoiceNo, oldVariantId, qty, refundAmount, reason } =
      req.body;

    const alreadyReturned = await Return.findOne({
      saleId,
      oldVariantId,
      type: "return",
    });

    if (alreadyReturned) {
      return res.status(400).json({
        msg: "Item already returned",
      });
    }

    await Variant.findByIdAndUpdate(oldVariantId, {
      $inc: { stock: qty },
    });

    await Return.create({
      saleId,
      invoiceNo,
      type: "return",
      oldVariantId,
      qty,
      refundAmount,
      reason,
      createdBy: req.user.id,
    });

    res.json({
      msg: "Return processed",
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

exports.processExchange = async (req, res) => {
  try {
    const {
      saleId,
      invoiceNo,
      oldVariantId,
      newVariantId,
      qty,
      extraPay,
      reason,
    } = req.body;

    // old stock back
    await Variant.findByIdAndUpdate(oldVariantId, {
      $inc: { stock: qty },
    });

    // new stock out
    await Variant.findByIdAndUpdate(newVariantId, {
      $inc: { stock: -qty },
    });

    await Return.create({
      saleId,
      invoiceNo,
      type: "exchange",
      oldVariantId,
      newVariantId,
      qty,
      extraPay,
      reason,
      createdBy: req.user.id,
    });

    res.json({
      msg: "Exchange completed",
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
