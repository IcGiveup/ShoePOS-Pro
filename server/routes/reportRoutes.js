const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  dashboardReport,
  analyticsReport,
} = require("../controllers/reportController");

// Dashboard
router.get(
  "/dashboard",
  auth,
  dashboardReport
);

// Analytics
router.get(
  "/analytics",
  auth,
  analyticsReport
);

module.exports = router;