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
  { timestamp: true }
);

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
