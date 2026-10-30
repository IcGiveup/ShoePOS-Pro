const router = require("express").Router();

const auth = require("../middleware/authMiddleware");

const {
  searchInvoice,
  processReturn,
  processExchange,
} = require("../controllers/returnController");

router.get(
  "/search/:invoiceNo",
  auth,
  searchInvoice
);

router.post(
  "/return",
  auth,
  processReturn
);

router.post(
  "/exchange",
  auth,
  processExchange
);

module.exports = router;