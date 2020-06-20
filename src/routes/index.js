const express = require("express");
const router = express.Router();

const category = require("./category.routes");
const product = require("./product.routes");
const order = require("./order.routes");
const users = require("./user.routes");

router.use("/category", category);
router.use("/product", product);
router.use("/order", order);
router.use("/users", users);

module.exports = router;
