const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares");
const { validateProfileEditData } = require("../utils/validation");
const User = require("../models/user");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("error signing up user" + " " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    // res.send(`${loggedInUser.firstName}, Your Profile Updated Successfully`);
    res.json({
      message: `${loggedInUser.firstName}, Your Profile Updated Successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("error signing up user" + " " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { emailId, password } = req?.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordMatch = await user.validatePassword(password);
    if (!isPasswordMatch && !Object.keys(req.body).includes("password")) {
      throw new Error("Invalid credentials");
    } else {
      const loggedInUser = req.user;
      loggedInUser.password = req.user.password;
      await loggedInUser.save();
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send("User signed in successfully");
    }
  } catch (err) {
    res.status(400).send("error signing up user" + " " + err.message);
  }
});

module.exports = profileRouter;
