const CONFIG = require("./config/config");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const api = require("./src/routes");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", api);

const port = CONFIG.SYSTEM.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
