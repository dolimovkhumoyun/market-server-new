const user = require("../models/userModel");

module.exports = {
  async auth(req, res) {
    const response = await user.authUser(req.body.username, req.body.password);
    res.header("token", response.token);
    return res.status(response.statusCode).send(response);
  },
};
