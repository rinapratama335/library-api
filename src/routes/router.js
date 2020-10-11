const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/authentication");
const { register: registration } = require("../controllers/auth");

router.post("/register", registration);

module.exports = router;
