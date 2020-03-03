const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User"
  },
  post: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Post"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Comment", commentSchema);
