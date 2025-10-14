const adminAuth = (req, res, next) => {
  console.log("Admin Middleware");
  let token = "xyz";
  if (token === "xyz") {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

module.exports = { adminAuth };
