const order = require("../models/orderModel");

module.exports = {
  async addToWatchlist(req, res) {
    const response = await order.addOrder(req.body.chat_id, req.body.product_id, req.body.amount);
    return res.status(response.statusCode).send(response);
  },
  async getWatchList(req, res) {
    const response = await order.getOrderItems(req.params.user_id);
    return res.send(response);
  },
  async cancelOrder(req, res) {
    const response = await order.cancelOrder(req.params.user_id);
    return res.status(response.statusCode).send(response);
  },
  async confirmOrder(req, res) {
    const response = await order.confirmOrder(req.body);
    return res.status(response.statusCode).send(response);
  },
};
