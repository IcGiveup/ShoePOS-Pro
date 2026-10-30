const router = require("express").Router();

const auth =
  require("../middleware/authMiddleware");

const role =
  require("../middleware/roleMiddleware");

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.get(
  "/",
  auth,
  role("admin"),
  getUsers
);

router.post(
  "/",
  auth,
  role("admin"),
  createUser
);

router.put(
  "/:id",
  auth,
  role("admin"),
  updateUser
);

router.delete(
  "/:id",
  auth,
  role("admin"),
  deleteUser
);

module.exports = router;