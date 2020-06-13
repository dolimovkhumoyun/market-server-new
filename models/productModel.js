const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const Joi = require("@hapi/joi");

const CONFIG = require("../config/config");

router.get("/all", (req, res) => {
  console.log(req.query);
  let query = "";
  if (req.query.category)
    query = `SELECT p_id as id, p_name as name, p_price as price, p_img as image, unit_name as unit, c_name as caregory 
                    FROM products NATURAL JOIN categories NATURAL JOIN units WHERE c_id = '${req.query.category}' ORDER BY p_id ASC`;
  else
    query = `SELECT p_id as id, p_name as name, p_price as price, p_img as image, unit_name as unit, c_name as caregory 
                    FROM products NATURAL JOIN categories NATURAL JOIN units ORDER BY p_id ASC`;
  const pool = new Pool(CONFIG.DB);
  pool.query(query, (error, results) => {
    if (error) return res.send({ status: 500, message: "Internal error", error });
    if (results.rowCount > 0) return res.send({ status: 200, results: results.rows });
    else return res.send({ status: 404, msg: "Not data found" });
  });
  pool.end();
});

router.get("/categories", (req, res) => {
  const query = `SELECT c_id as id, c_name as name FROM categories`;
  const pool = new Pool(CONFIG.DB);
  pool.query(query, (error, results) => {
    if (error) return res.send({ status: 500, message: "Internal error", error });
    if (results.rowCount > 0) return res.send({ status: 200, results: results.rows });
    else return res.send({ status: 404, msg: "Not data found" });
  });
  pool.end();
});

router.get("/", (req, res) => {
  const query = `SELECT ARRAY_AGG(jsonb_build_object('price', p.p_price, 'name', p.p_name)) AS list, c.c_name
                FROM 
                products p JOIN categories c ON p.c_id = c.c_id GROUP BY c.c_name`;
  const pool = new Pool(CONFIG.DB);
  pool.query(query, (error, results) => {
    if (error) return res.send({ status: 500, message: "Internal error", error });
    if (results.rowCount > 0) return res.send({ status: 200, results: results.rows });
    else return res.send({ status: 404, msg: "Not data found" });
  });
  pool.end();
});

router.get("/product", (req, res) => {
  const query = `SELECT p_id, p_name, p_price, p_img, c_name, unit_name FROM products 
                  natural join categories natural join units WHERE c_id = ${req.query.c_id} `;
  const pool = new Pool(CONFIG.DB);
  pool.query(query, (error, results) => {
    if (error) return res.send({ status: 500, message: "Internal error", error });
    if (results.rowCount > 0) return res.send({ status: 200, results: results.rows });
    else return res.send({ status: 404, msg: "Not data found" });
  });
  pool.end();
});

module.exports = router;
