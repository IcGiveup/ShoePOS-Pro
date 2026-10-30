const express = require("express");
const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

const {
  scanBarcode,
  checkout
} = require("../controllers/posController");

router.get("/scan/:barcode", auth, scanBarcode);
router.post("/checkout", auth, checkout);

module.exports = router;