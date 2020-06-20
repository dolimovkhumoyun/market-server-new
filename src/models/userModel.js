const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const config = require("../../config/config");

class User {
  constructor() {
    this.pool = new Pool(config.DB);
  }

  authUser = async (username, password) => {
    const query = `SELECT * FROM admin_users WHERE username = '${username}' LIMIT 1`;
    try {
      let response = await this.pool.query(query);
      if (response.rowCount <= 0) return { statusCode: 404, message: "User not found" };

      if (this.checkPasswordMD5(password, response.rows[0].password)) {
        let { id, full_name } = response.rows[0];
        let token = this.generateToken(id, full_name);
        return { statusCode: 200, token, data: { id, full_name } };
      } else return { statusCode: 404, message: "User not found" };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        error,
      };
    }
  };

  checkPasswordMD5 = (password, db_password) => {
    return bcrypt.compareSync(password, db_password);
  };

  generateToken = (id, full_name) => {
    const token = jwt.sign({ id: id, full_name: full_name }, config.SECRET, {
      expiresIn: config.SESSION_TIMEOUT,
    });
    return token;
  };
}

module.exports = new User();
