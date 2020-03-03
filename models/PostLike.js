const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const PostLikeSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.ObjectId, required: true, ref: "Post" },
  users_likes: [
    {
      author: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
      }
    }
  ]
});

module.exports = mongoose.model("PostLike", PostLikeSchema);
