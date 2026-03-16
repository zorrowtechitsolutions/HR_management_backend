const router = require("express").Router();

const {
  createUser,
  getUsers,
  updateUser,
  deleteUser
} = require("../controllers/userController");

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;