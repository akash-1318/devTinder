const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const allowedStatuses = ["ignored", "interested"];
      if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid status value");
      }

      // Suppose we have millions of request in our database thn this query will become very hard ---> when we query together in that case we need to index them both in that case use 'compund index'
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("Target user does not exist");
      }

      if (existingRequest) {
        return res
          .status(400)
          .send("Request already exists between these users");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message: `Request ${status}ed successfully`,
        data,
      });
    } catch (err) {
      res.status(400).send("error sending request" + " " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const requestId = req.params.requestId;
      const status = req.params.status;

      const allowedStatuses = ["accepted", "rejected"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).send("Invalid status value");
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      console.log("connectionRequest", connectionRequest);
      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "No pending request found to review" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: `Request ${status}ed successfully`,
        data,
      });
    } catch (err) {
      res.status(400).send("error reviewing request" + " " + err.message);
    }
  }
);

module.exports = requestRouter;
