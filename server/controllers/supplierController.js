const Supplier = require("../models/Supplier");
const Purchase = require("../models/Purchase");

exports.createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.getSuppliers = async (req, res) => {
  const suppliers = await Supplier.find()
    .sort({ createdAt: -1 });

  res.json(suppliers);
};
exports.deleteSupplier = async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(
      req.params.id
    );

    res.json({
      msg: "Supplier Deleted"
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message
    });
  }
};

exports.getSupplierHistory =
  async (req, res) => {
    const history =
      await Purchase.find({
        supplierId:
          req.params.id,
      }).sort({
        createdAt: -1,
      });

    res.json(history);
  };