const router = require("express").Router();

const auth = require("../middleware/authMiddleware");

const {
  createGRN,
  getPurchases,
} = require("../controllers/purchaseController");

router.get("/", auth, getPurchases);

router.post("/", auth, createGRN);

module.exports = router;