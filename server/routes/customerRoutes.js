const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
  getCustomers,
  searchCustomer,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  purchaseHistory,
  redeemPoints,
} = require("../controllers/customerController");

router.get("/", auth, getCustomers);
router.get("/search/:phone", auth, searchCustomer);
router.post("/", auth, addCustomer);
router.put("/:id", auth, updateCustomer);
router.delete("/:id", auth, deleteCustomer);
router.get("/history/:id", auth, purchaseHistory);
router.post("/redeem/:id", auth, redeemPoints);

module.exports = router;