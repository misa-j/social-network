const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const replySchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User"
  },
  commentAt: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Comment"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Reply", replySchema);
