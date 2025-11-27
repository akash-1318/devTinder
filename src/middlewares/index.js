const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminAuth = (req, res, next) => {
  let token = "xyz";
  if (token === "xyz") {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

const userAuth = async (req, res, next) => {
  try {
    // Read cookies
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      return res.status(401).send("Unauthorized");
    }
    // Verify Token
    const decodedMessage = await jwt.verify(token, "Dev@Tinder$189");
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exist");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Unauthorized");
  }
};

module.exports = { adminAuth, userAuth };
