const Customer = require("../models/Customer");
const Sale = require("../models/Sale");

/* =========================
   GET ALL CUSTOMERS
   ========================= */
exports.getCustomers = async (req, res) => {
  try {
    const keyword = req.query.search || "";

    const customers = await Customer.find({
      phone: { $regex: keyword, $options: "i" },
    }).sort({ createdAt: -1 });

    res.json(customers);
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

/* =========================
   SEARCH CUSTOMER BY PHONE
   ========================= */
exports.searchCustomer = async (req, res) => {
  try {
    const phone = req.params.phone.trim();

    const customer = await Customer.findOne({
      phone,
    });

    if (!customer) {
      return res.status(404).json({
        msg: "Customer not found",
      });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

/* =========================
   ADD CUSTOMER
   ========================= */
exports.addCustomer = async (req, res) => {
  try {
    const { name, phone, email, address } =
      req.body;

    const exist = await Customer.findOne({
      phone,
    });

    if (exist) {
      return res.status(400).json({
        msg: "Phone already exists",
      });
    }

    const customer = await Customer.create({
      name,
      phone,
      email,
      address,
      points: 0,
    });

    res.json(customer);
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

/* =========================
   UPDATE CUSTOMER
   ========================= */
exports.updateCustomer = async (req, res) => {
  try {
    const customer =
      await Customer.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(customer);
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

/* =========================
   DELETE CUSTOMER
   ========================= */
exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(
      req.params.id
    );

    res.json({
      msg: "Customer deleted",
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

/* =========================
   PURCHASE HISTORY
   ========================= */
exports.purchaseHistory = async (
  req,
  res
) => {
  try {
    const customer =
      await Customer.findById(
        req.params.id
      );

    const sales = await Sale.find({
      customerPhone: customer.phone,
    }).sort({ createdAt: -1 });

    res.json({
      customer,
      sales,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

/* =========================
   REDEEM POINTS
   ========================= */
exports.redeemPoints = async (
  req,
  res
) => {
  try {
    const { points } = req.body;

    const customer =
      await Customer.findById(
        req.params.id
      );

    if (customer.points < points) {
      return res.status(400).json({
        msg: "Not enough points",
      });
    }

    customer.points -= points;
    await customer.save();

    res.json({
      msg: "Points redeemed",
      discount: points,
      customer,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};