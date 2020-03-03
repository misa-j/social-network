const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const FollowingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  following: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
      }
    }
  ]
});

module.exports = mongoose.model("Following", FollowingSchema);
