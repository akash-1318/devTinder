const express = require("express");
const { connectDB } = require("./config/database");
require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser");

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

app.use(express.json()); // to read the json data coming in request
app.use(cookieParser());

// app.get("/user", async (req, res) => {
//   const userEmail = req.body.emailId;
//   try {
//     const user = await User.findOne({ emailId: userEmail });
//     if (!user) {
//       return res.status(404).send("User not found");
//     } else {
//       res.json(user);
//     }
//   } catch (err) {
//     res.status(500).send("Error fetching users");
//   }
// });

// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.json(users);
//   } catch (err) {
//     res.status(500).send("Error fetching users");
//   }
// });

// app.delete("/deleteUser", async (req, res) => {
//   const userId = req.body.userId;
//   try {
//     const user = await User.findByIdAndDelete(userId);
//     res.send("User deleted successfully");
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params?.userId;
//   const data = req.body;
//   try {
//     const ALLOWED_UPDATES = ["age", "photoUrl", "about", "skills"];
//     const isUpdateAllowed = Object.keys(data)?.every((ele) =>
//       ALLOWED_UPDATES.includes(ele)
//     );
//     if (!isUpdateAllowed) {
//       throw new Error("Invalid updates!");
//     }
//     if (data.skills.length > 10) {
//       throw new Error("Skills cannot be more than 10");
//     }
//     const user = await User.findByIdAndUpdate(userId, data, {
//       returnDocument: "after",
//       runValidators: true,
//     });
//     res.send("User updated successfully");
//   } catch (err) {
//     res.status(400).send("Something went wrong" + " " + err.message);
//   }
// });

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("Connection successfull!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => console.log(err));
