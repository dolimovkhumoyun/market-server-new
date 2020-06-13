const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const Joi = require("@hapi/joi");

const CONFIG = require("../config/config");

const orderSchema = Joi.object({
  chat_id: Joi.number().required(),
  product: Joi.number().required(),
  amount: Joi.number().required(),
});

const clearBoxSchema = Joi.object({
  order_id: Joi.number().required(),
});

const clearByProductSchema = Joi.object({
  order_id: Joi.number().required(),
  product_id: Joi.number().required(),
});

const schema = Joi.object({
  chat_id: Joi.number().required(),
});

router.get("/", (req, res) => {
  const { error, value } = schema.validate(req.query);

  if (error)
    return res.send({
      status: 400,
      message: "Bad request",
      error: error.details[0].message,
    });
  const query = `SELECT 
                    o.o_id, p.p_name, p.p_price, p.p_id, SUM(oi.quantity) FILTER (WHERE oi.p_id = p.p_id) as amount 
                  FROM 
                  orders o
                  JOIN
                  order_items oi ON o.o_id = oi.o_id
                  JOIN
                  products p ON oi.p_id = p.p_id
                  WHERE 
                  o.u_id = ${value.chat_id} AND o.status = 1
                  GROUP BY p.p_id, p.p_name, o.o_id
 
 `;
  const pool = new Pool(CONFIG.DB);
  pool.query(query, (error, results) => {
    console.log(query);
    if (error) return res.send({ status: 500, message: "Internal error", error });
    if (results.rowCount <= 0) return res.send({ status: 404, msg: "No data found" });
    let outcome = {
      order_id: results.rows[0].o_id,
      list: [results.rows],
    };
    return res.send({ status: 200, results: outcome });
  });
  pool.end();
});

router.post("/", async (req, res) => {
  const { error, value } = orderSchema.validate(req.body);

  if (error)
    return res.send({
      status: 400,
      message: "Bad request",
      error: error.details[0].message,
    });

  let insertQuery = "";
  const checkQuery = `SELECT o_id, u_id, status FROM orders WHERE u_id = ${value.chat_id} AND status = 1`;

  const response = await checkOrder(value.chat_id);
  console.log(response);
  // IF there is not active watchlist means all orders of this user has been certified
  if (!response) {
    insertQuery = `
      INSERT INTO orders(u_id) VALUES (${value.chat_id});
      SELECT * FROM orders where u_id = ${value.chat_id} AND status = 1;`;
    const orderRes = await getOrder(value.chat_id, res);
    insertQuery = `INSERT INTO order_items(o_id, p_id, quantity)
                   VALUES (${orderRes.o_id}, ${value.product}, ${value.amount})`;
  } else {
    insertQuery = `INSERT INTO order_items(o_id, p_id, quantity)
                   VALUES (${response.o_id}, ${value.product}, ${value.amount})`;
  }
  const pool = new Pool(CONFIG.DB);
  pool.query(insertQuery, (error, results) => {
    console.log(insertQuery);
    if (error) return res.send({ status: 500, message: "Internal error", error });
    return res.send({ status: 200 });
  });
  pool.end();
});

router.post("/clear", (req, res) => {
  const { error, value } = clearBoxSchema.validate(req.body);

  if (error)
    return res.send({
      status: 400,
      message: "Bad request",
      error: error.details[0].message,
    });
  const query = `UPDATE orders SET status = 2 WHERE o_id = ${value.order_id}`;
  const pool = new Pool(CONFIG.DB);
  pool.query(query, (error, results) => {
    if (error) return res.send({ status: 500, message: "Internal error", error });
    return res.send({ status: 200, results: results.rows });
  });
  pool.end();
});

router.post("/clear/item", (req, res) => {
  const { error, value } = clearByProductSchema.validate(req.body);

  if (error)
    return res.send({
      status: 400,
      message: "Bad request",
      error: error.details[0].message,
    });
  const query = `DELETE FROM order_items WHERE o_id = ${value.order_id} AND p_id = ${value.product_id}`;
  const pool = new Pool(CONFIG.DB);
  pool.query(query, (error, results) => {
    console.log(query);
    if (error) return res.send({ status: 500, message: "Internal error", error });
    return res.send({ status: 200 });
  });
  pool.end();
});

// =================================================

async function getOrder(chat_id, res) {
  const insertQuery = `
      INSERT INTO orders(u_id) VALUES (${chat_id});
      SELECT * FROM orders where u_id = ${chat_id} AND status = 1;`;
  const pool = new Pool(CONFIG.DB);
  return pool
    .query(insertQuery)
    .then((result) => {
      return result[1].rows[0];
    })
    .catch((err) => res.send({ error: err }));
}

async function checkOrder(chat_id) {
  const checkQuery = `SELECT o_id, u_id, status FROM orders WHERE u_id = ${chat_id} AND status = 1`;
  const pool = new Pool(CONFIG.DB);
  const res = await pool.query(checkQuery);
  if (res.rowCount === 0) return false;
  else return res.rows[0];
}

module.exports = router;
