const category = require("../models/categoryModel");

module.exports = {
  async getCategories(req, res) {
    const response = await category.getCategories();
    return res.status(response.statusCode).send(response);
  },
};
