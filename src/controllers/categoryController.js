const category = require("../models/categoryModel");

module.exports = {
  async getCategories(req, res) {
    const response = await category.getCategories();
    return res.status(response.statusCode).send(response);
  },
  async editCategory(req, res) {
    console.log(req.body);
    const response = await category.editCategory(req.body.id, req.body.name);
    return res.status(response.statusCode).send(response);
  },
};
