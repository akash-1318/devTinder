const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
});

module.exports = requestRouter;
