const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model (Creating relationship between two collections)
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        //Enum validation to ensure status is one of the predefined values
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamp: true },
);

// When I index my db, APIs become faster and I can index certain fields. because it will create a separate data structure to store the indexed fields and their corresponding document references, allowing for quick lookups. However, indexing can also slow down write operations (like insert, update, delete) because the index needs to be updated every time a document is modified. Therefore, it's important to choose which fields to index based on the query patterns of your application.

// Compound Index (This will make the query Fast)
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  // You can add any pre-save logic here if needed

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("fromUserId and toUserId cannot be the same");
  }
  next();
});

module.exports = mongoose.model("connectionRequest", connectionRequestSchema);
