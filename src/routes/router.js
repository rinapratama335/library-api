const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/authentication");
const { register: registration, login } = require("../controllers/auth");
const { getAllUsers, deleteUser } = require("../controllers/user");

router.post("/register", registration);
router.post("/login", login);

router.get("/users", auth, getAllUsers);
router.delete("/user/:id", auth, deleteUser);

module.exports = router;
