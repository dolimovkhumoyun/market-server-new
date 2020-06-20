const express = require("express");
const router = express.Router();

const order = require("../controllers/orderController");

router.get("/:user_id", order.getWatchList);
router.post("/", order.addToWatchlist);
router.delete("/:user_id", order.cancelOrder);
router.post("/confirm", order.confirmOrder);

module.exports = router;
