const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");

const CONFIG = require("../config/config");

const schemaLocal = Joi.object({
  chat_id: Joi.number().required(),
  first_name: Joi.string().required(),
  username: Joi.string().allow(""),
});

router.post("/", (req, res) => {
  const { error, value } = schemaLocal.validate(req.body);
  console.log(req.body.chat_id);

  if (error)
    return res.send({
      status: 400,
      message: "Bad request",
      error: error.details[0].message,
    });

  const query = `INSERT INTO users
   (u_id, username, first_name)
    VALUES 
   (${value.chat_id}, '${value.username}', '${value.first_name}')`;

  const pool = new Pool(CONFIG.DB);
  pool.query(query, (error, results) => {
    if (error)
      return res.send({ status: 500, message: "Internal error", error });
    return res.send({ status: 200 });
  });
  pool.end();
});

module.exports = router;
