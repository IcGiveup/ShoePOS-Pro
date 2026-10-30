const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const role = require("../middleware/roleMiddleware");

const {
  createSupplier,
  getSuppliers,
  deleteSupplier,
  getSupplierHistory,
} = require("../controllers/supplierController");

router.post(
  "/",
  auth,
  role("admin"),
  createSupplier
);


router.get(
  "/",
  auth,
  getSuppliers
);

router.get(
  "/:id/history",
  auth,
  getSupplierHistory
);

router.delete(
  "/:id",
  auth,
  role("admin"),
  deleteSupplier
);

module.exports = router;