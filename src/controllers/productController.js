const product = require("../models/productModel");

module.exports = {
  async getProducts(req, res) {
    const response = await product.getProducts(req.params.category);
    return res.status(response.statusCode).send(response);
  },
  async getProduct(req, res) {
    const response = await product.getProduct(req.params.product);
    return res.status(response.statusCode).send(response);
  },
};
