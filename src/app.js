const express = require("express");
const { adminAuth, userAuth } = require("./middlewares");
const { connectDB } = require("./config/database");
require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

// For get it will match the exact path but for use '/user' can fall under '/'
// When I'm calling this route (http://localhost:3000/admin/getAllData) for 'use' it will also call (http://localhost:3000/admin) this route. But if I call this route (http://localhost:3000/admin) it would not execute this route (http://localhost:3000/admin/getAllData)

// app.get("/user", (req, res) => {
//   res.send("Hello, World!");
// });

// app.post("/user", (req, res) => {
//   res.send("User created!");
// });

// app.delete("/user", (req, res) => {
//   res.send("User deleted!");
// });

// app.use("/route", rH0, [rH1, rH2], rH3);

// app.use(
//   "/user",
//   (req, res, next) => {
//     console.log("hello response");
//     // res.send("Hello, Test World!");
//     next();
//   },
//   (req, res, next) => {
//     res.send("Hello, Testtt World!");
//     console.log("Me hu na");
//   }
// );

// app.use("/user/data", (req, res, next) => {
//   res.send("Hello, Middleware World!");
//   next();
// });

// app.use("/admin", adminAuth);

// app.get("/admin/getAllData", (req, res, next) => {
//   res.send("Hello, Admin World!");
// });

// app.delete("/admin/deleteAllData", (req, res) => {
//   res.send("All data deleted");
// });

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

    await user.save();
    res.send("User signed up successfully");
  } catch (err) {
    res.status(400).send("error signing up user" + " " + err.message);
  }
});

app.post("/login", async (req, res) => {
  // User login with Email and password, server validate email and password and after this server will create a jwt token -
  // - wrapped it inside a cookie and send it to browser.Now for each api request server will validate this cookie and only thn it will send response.
  try {
    const { emailId, password } = req?.body;
    const user = await User.findOne({ emailId });
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
      res.cookie("token", token);
      res.send("User signed in successfully");
    }
  } catch (err) {
    res.status(400).send("error signing up user" + " " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("error signing up user" + " " + err.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.json(user);
    }
  } catch (err) {
    res.status(500).send("Error fetching users");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).send("Error fetching users");
  }
});

app.delete("/deleteUser", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["age", "photoUrl", "about", "skills"];
    const isUpdateAllowed = Object.keys(data)?.every((ele) =>
      ALLOWED_UPDATES.includes(ele)
    );
    if (!isUpdateAllowed) {
      throw new Error("Invalid updates!");
    }
    if (data.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong" + " " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Connection successfull!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => console.log(err));
