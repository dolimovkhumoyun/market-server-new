const { Pool } = require("pg");
const config = require("../../config/config");

class Category {
  constructor() {
    this.pool = new Pool(config.DB);
  }
  getCategories = async () => {
    try {
      let response = await this.pool.query("SELECT c_id as id, c_name as name from categories");
      if (response.rowCount < 0) return { statusCode: 404, message: "Item not found" };
      return { statusCode: 200, data: response.rows };
    } catch (error) {
      return {
        statusCode: 500,
        error,
      };
    }
  };

  editCategory = async (id, name) => {
    try {
      let response = await this.pool.query(`UPDATE categories SET c_name = '${name}' WHERE c_id = ${id}`);
      return { statusCode: 200, data: response.rows };
    } catch (error) {
      return {
        statusCode: 500,
        error,
      };
    }
  };
}

module.exports = new Category();
