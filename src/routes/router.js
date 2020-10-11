const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/authentication");
const { register: registration, login } = require("../controllers/auth");

router.post("/register", registration);
router.post("/login", login);

module.exports = router;
