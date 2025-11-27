const express = require("express");
const User = require("../models/user");
const connectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares");
const userRouter = express.Router();

// Get all pending connection requests for logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await connectionRequest
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate(
        "fromUserId",
        "firstName lastName age gender about skills photoUrl"
      );
    //   .populate("fromUserId", [
    //     "firstName",
    //     "lastName",
    //   ]); // populate to get the user details from user collection

    res.json({
      message: "User fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(500).send("Error fetching users");
  }
});

// Get all connections for logged in user
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await connectionRequest
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate(
        "fromUserId",
        "firstName lastName age gender about skills photoUrl"
      )
      .populate(
        "toUserId",
        "firstName lastName age gender about skills photoUrl"
      );

    const data = connectionRequests.map((request) => {
      if (request.fromUserId._id.equals(loggedInUser._id)) {
        return request.toUserId;
      } else {
        return request.fromUserId;
      }
    });

    res.json({
      message: "User fetched successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).send("Error fetching users");
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit; // Max limit of 50
    let skip = (page - 1) * limit;

    const loggedInUser = req.user;
    const connectionRequests = await connectionRequest
      .find({
        $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
      })
      .select("toUserId fromUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((request) => {
      hideUsersFromFeed.add(request.toUserId.toString());
      hideUsersFromFeed.add(request.fromUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName age gender about skills photoUrl")
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.status(500).send("Error fetching users");
  }
});

module.exports = userRouter;
