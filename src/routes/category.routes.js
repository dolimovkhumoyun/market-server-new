const express = require("express");
const router = express.Router();

const cat = require("../controllers/categoryController");

router.get("/all", cat.getCategories);

module.exports = router;
