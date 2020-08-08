const express = require("express");
const router = express.Router();

const cat = require("../controllers/categoryController");

router.get("/all", cat.getCategories);
router.put("/", cat.editCategory);

module.exports = router;
