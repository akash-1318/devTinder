const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares");
const { validateProfileEditData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

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
    const { currentPassword, newPassword } = req?.body || {};
    if (!currentPassword || !newPassword) {
      throw new Error("Current password and new password are required");
    }

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Password is not strong enough");
    }

    const loggedInUser = req.user;
    const isPasswordMatch = await loggedInUser.validatePassword(
      currentPassword
    );
    if (!isPasswordMatch) {
      throw new Error("Invalid credentials");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = hashedPassword;
    await loggedInUser.save();

    const token = await loggedInUser.getJWT();
    res.cookie("token", token);
    res.send("Password updated successfully");
  } catch (err) {
    res.status(400).send("error updating password" + " " + err.message);
  }
});

module.exports = profileRouter;
