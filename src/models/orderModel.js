const { Pool } = require("pg");
const config = require("../../config/config");
const e = require("express");

class Order {
  constructor() {
    this.pool = new Pool(config.DB);
  }

  getOrderItems = async (user_id) => {
    let query = `SELECT o.o_id , p.p_name as name, p.p_price as price, p.p_id, u.unit_name, SUM(oi.quantity) FILTER (WHERE oi.p_id = p.p_id) as amount 
                    ,p.p_price * SUM(oi.quantity) as sum FROM orders o
                    JOIN order_items oi ON o.o_id = oi.o_id JOIN products p ON oi.p_id = p.p_id JOIN units u ON p.unit_id = u.unit_id
                    WHERE o.u_id = '${user_id}' AND o.status = 1 GROUP BY p.p_id, p.p_name, o.o_id, u.unit_name`;
    try {
      let response = await this.pool.query(query);
      if (response.rowCount <= 0) return { statusCode: 404, message: "No items found" };
      return { statusCode: 200, data: response.rows };
    } catch (error) {
      return { statusCode: 500, error };
    }
  };

  addOrder = async (chat_id, product_id, amount) => {
    let response = await this.getProcessing(chat_id);
    if (response.statusCode === 200) {
      let order_id = response.data[0].o_id;
      response = await this.addOrderItem(order_id, product_id, amount);
    } else if (response.statusCode === 404) {
      response = await this.addOrderAndItem(chat_id, product_id, amount);
    }
    return response;
  };

  cancelOrder = async (user_id) => {
    let query = `UPDATE orders SET status = 0 WHERE u_id = '${user_id}' AND status =1`;
    try {
      let response = await this.pool.query(query);
      return { statusCode: 200, data: response.rows };
    } catch (error) {
      console.log(error);
      return { statusCode: 500, error };
    }
  };

  confirmOrder = async ({ user_id, phone_number, lat, long }) => {
    let query = `UPDATE orders SET 
    contact = '${phone_number}', location = ST_SetSRID(ST_MakePoint(${long}, ${lat}), 4326), status = 2
         WHERE u_id = ${user_id} AND status = 1`;
    try {
      console.log(query);
      let response = await this.pool.query(query);
      return { statusCode: 200 };
    } catch (error) {
      console.log(error);
      return { statusCode: 500, error };
    }
  };

  // Get one
  getProcessing = async (user_id) => {
    let query = `SELECT o_id FROM orders WHERE u_id = ${user_id} AND status = 1 LIMIT 1`;
    try {
      let response = await this.pool.query(query);
      if (response.rowCount <= 0) return { statusCode: 404 };
      return { statusCode: 200, data: response.rows };
    } catch (error) {
      return { statusCode: 500, error };
    }
  };

  // Add Item, if user has processing ORDER
  addOrderItem = async (order_id, product_id, amount) => {
    let query = `INSERT INTO order_items (o_id, p_id, quantity) VALUES (${order_id}, ${product_id}, ${amount})`;
    try {
      let response = await this.pool.query(query);
      return { statusCode: 200 };
    } catch (error) {
      return { statusCode: 500, error };
    }
  };

  // First add order and then adds Item with order_id previously inserted
  addOrderAndItem = async (user_id, p_id, amount) => {
    let insert_query = `INSERT INTO orders (u_id, status) VALUES ('${user_id}', 1) returning o_id;`;
    try {
      let response = await this.pool.query(insert_query);
      if (response.rows[0].o_id) {
        let query = `INSERT INTO order_items (o_id, p_id, quantity) VALUES (${response.rows[0].o_id}, ${p_id},${amount})`;
        let res = await this.pool.query(query);
        return { statusCode: 200, message: "Item has successfully been added" };
      }
      console.log(response.rows[0]);
    } catch (error) {
      return { statusCode: 500, error };
    }
  };
}

module.exports = new Order();
