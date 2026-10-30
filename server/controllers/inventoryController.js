const Variant = require("../models/Variant");
const Product = require("../models/Product");
const InventoryLog = require("../models/InventoryLog");

// =====================================
// GET INVENTORY
// =====================================
exports.getInventory = async (req, res) => {
  try {
    const variants = await Variant.find()
      .populate("productId")
      .sort({ createdAt: -1 });

    res.json(variants);
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

// =====================================
// UPDATE STOCK
// =====================================
exports.updateStock = async (req, res) => {
  try {
    const variant =
      await Variant.findById(
        req.params.variantId
      );

    if (!variant) {
      return res.status(404).json({
        msg: "Variant not found",
      });
    }

    const {
      action,
      quantity,
      reason,
    } = req.body;

    const qty = Number(quantity);

    if (qty <= 0) {
      return res.status(400).json({
        msg: "Quantity must be greater than zero",
      });
    }

    const previousStock =
      variant.stock;

    let newStock = previousStock;

    if (action === "stock_in") {
      newStock += qty;
    }

    if (action === "stock_out") {
      newStock -= qty;
    }

    if (action === "adjustment") {
      newStock = qty;
    }

    if (newStock < 0) {
      return res.status(400).json({
        msg: "Stock cannot be negative",
      });
    }

    variant.stock = newStock;

    await variant.save();

    await InventoryLog.create({
      variantId: variant._id,
      action,
      quantity: qty,
      previousStock,
      newStock,
      reason,
      createdBy: req.user.id,
    });

    res.json({
      msg: "Inventory updated",
      variant,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

// =====================================
// INVENTORY LOGS
// =====================================
exports.getLogs = async (req, res) => {
  try {
    const logs =
      await InventoryLog.find()
        .populate("variantId")
        .populate("createdBy", "name")
        .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};