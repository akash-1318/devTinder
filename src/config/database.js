const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://admin-akash:4meEYmT9qpPex8TE@node-cluster.nejgjbw.mongodb.net/devTinder"
  );
};

module.exports = { connectDB };
