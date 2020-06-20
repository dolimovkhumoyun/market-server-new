const { Pool } = require("pg");
const config = require("../../config/config");

class Product {
  constructor() {
    this.pool = new Pool(config.DB);
  }
  getProducts = async (id) => {
    const query = `SELECT p_id as id, p_name as name FROM products WHERE c_id = ${id} `;
    try {
      let response = await this.pool.query(query);
      if (response.rowCount < 0) return { statusCode: 404, message: "Item not found" };
      return { statusCode: 200, data: response.rows };
    } catch (error) {
      return {
        statusCode: 500,
        error,
      };
    }
  };

  getProduct = async (id) => {
    const query = `SELECT p_id as id, p_name as name, p_price as price, p_img as img FROM products WHERE p_id = ${id} `;
    try {
      let response = await this.pool.query(query);
      if (response.rowCount < 0) return { statusCode: 404, message: "Item not found" };
      return { statusCode: 200, data: response.rows };
    } catch (error) {
      return {
        statusCode: 500,
        error,
      };
    }
  };
}

module.exports = new Product();
