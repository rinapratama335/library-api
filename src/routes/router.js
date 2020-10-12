const express = require("express");
const router = express.Router();

const { auth, authAdmin } = require("../middleware/authentication");
const { register: registration, login } = require("../controllers/auth");
const { getAllUsers, deleteUser } = require("../controllers/user");
const {
  getAllCategories,
  getDetailCategory,
  addCategory,
  editCategory,
  deleteCategory,
} = require("../controllers/category");

router.post("/register", registration);
router.post("/login", login);
router.get("/users", auth, getAllUsers);
router.delete("/user/:id", auth, deleteUser);

router.get("/categories", auth, getAllCategories);
router.get("/category/:id", auth, getDetailCategory);
router.post("/category", auth, authAdmin, addCategory);
router.patch("/category/:id", auth, authAdmin, editCategory);
router.delete("/category/:id", auth, authAdmin, deleteCategory);

module.exports = router;
