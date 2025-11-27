const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req?.body;
    // Instead of saving password as it is in database we will save it in hash format and for that we will use bcrypt npm package
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User signed up successfully", data: savedUser });
  } catch (err) {
    res.status(400).send("error signing up user" + " " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  // User login with Email and password, server validate email and password and after this server will create a jwt token -
  // - wrapped it inside a cookie and send it to browser.Now for each api request server will validate this cookie and only thn it will send response.
  try {
    const { emailId, password } = req?.body;
    const user = await User.findOne({ emailId }); // User is the model for which I'm getting dat from database
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // helper function to validate password ---> these helper functions are closely related to user so it make sense to attach them with schema
    const isPasswordMatch = await user.validatePassword(password);
    if (!isPasswordMatch) {
      throw new Error("Invalid credentials");
    } else {
      // getJWT() is helper function to create a token
      const token = await user.getJWT();
      // ---> we can set the expiry of jwt and cookies.
      // Add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // cookie will expire in 8 hours
      });
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("error signing up user" + " " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send();
});

module.exports = authRouter;
