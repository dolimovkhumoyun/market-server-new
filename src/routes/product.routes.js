const express = require("express");
const router = express.Router();

const product = require("../controllers/productController");

router.get("/:product", product.getProduct);
router.get("/bycategory/:category", product.getProducts);

module.exports = router;
