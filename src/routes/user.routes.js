const express = require("express");
const router = express.Router();

const user = require("../controllers/userController");

router.post("/", user.auth);

module.exports = router;
