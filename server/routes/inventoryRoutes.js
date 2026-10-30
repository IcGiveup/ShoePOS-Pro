const router = require("express").Router();

const auth =
  require("../middleware/authMiddleware");

const role =
  require("../middleware/roleMiddleware");

const {
  getInventory,
  updateStock,
  getLogs,
} = require("../controllers/inventoryController");

router.get(
  "/",
  auth,
  role("admin"),
  getInventory
);

router.get(
  "/logs",
  auth,
  role("admin"),
  getLogs
);

router.put(
  "/:variantId",
  auth,
  role("admin"),
  updateStock
);



module.exports = router;