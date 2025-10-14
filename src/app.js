const express = require("express");
const { adminAuth } = require("./middlewares");

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

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res, next) => {
  res.send("Hello, Admin World!");
});

app.delete("/admin/deleteAllData", (req, res) => {
  res.send("All data deleted");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
