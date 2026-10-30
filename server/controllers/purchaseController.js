const Purchase = require("../models/Purchase");
const Variant = require("../models/Variant");
const InventoryLog = require("../models/InventoryLog");

exports.getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("supplierId", "name company")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.json(purchases);
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

exports.createGRN = async (req, res) => {
  try {
    const { supplierId, items } = req.body;

    let totalCost = 0;

    for (const item of items) {
      totalCost +=
        item.qty * item.costPrice;
    }

    // Increase stock
    for (const item of items) {
  const variant =
    await Variant.findById(
      item.variantId
    );

  const previousStock =
    variant.stock;

  variant.stock += Number(
    item.qty
  );

  // IMPORTANT
  variant.costPrice = Number(
    item.costPrice
  );

  await variant.save();

  await InventoryLog.create({
    variantId: variant._id,

    action: "purchase",

    quantity: item.qty,

    previousStock,

    newStock: variant.stock,

    reason: `GRN ${Date.now()}`,

    createdBy: req.user.id,
  });
}

    const grnNo =
      "GRN-" + Date.now().toString().slice(-8);

    const purchase =
      await Purchase.create({
        grnNo,
        supplierId,
        items,
        totalCost,
        createdBy: req.user.id
      });

    res.status(201).json({
      msg: "GRN Created",
      purchase
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message
    });
  }
};