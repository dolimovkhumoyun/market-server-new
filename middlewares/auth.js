const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const CONFIG = require("../config/config");

module.exports = function(req, res, next) {
  if (req.headers.token) {
    jwt.verify(req.headers.token, CONFIG.SECRET, (err, decoded) => {
      if (err) return res.send({ status: 401, message: "Unauthorized", err });
      const pool = new Pool(CONFIG.DB);

      pool.query("SELECT 1+1 AS NUMBER", err => {
        if (err)
          return res.status({
            status: 500,
            message: "Could not connect to database"
          });
        req.pgPool = pool;
        next();
      });
    });
  } else {
    return res.send({ status: 401, message: "Unauthorized" });
  }
};
