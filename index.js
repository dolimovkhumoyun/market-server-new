const CONFIG = require("./config/config");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const user = require("./models/userModel");
const order = require("./models/orderModel");
const product = require("./models/productModel");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/users", user);
app.use("/product", product);
app.use("/order", order);

const port = CONFIG.CLINIC.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
