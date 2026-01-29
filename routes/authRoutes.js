const express = require("express");
const { loginAdmin, loginUser } = require("../src/controllers/authController");

const router = express.Router();

router.post("/admin/login", loginAdmin);
router.post("/users/login", loginUser);

module.exports = router;

