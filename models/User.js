const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const postLikeSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Post"
  }
});

const commentLikeSchema = new mongoose.Schema({
  comment: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Comment"
  }
});

const commentReplyLikeSchema = new mongoose.Schema({
  comment: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Reply"
  }
});

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
    trim: true,
    match: /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
    trim: true,
    match: /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/
  },
  username: {
    type: String,
    minlength: 3,
    maxlength: 30,
    trim: true,
    match: /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/,
    required: true,
    unique: true
  },
  bio: {
    type: String,
    default: "",
    trim: true,
    maxlength: 250
  },
  email: {
    type: String,
    trim: true,
    required: true,
    maxlength: 40,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: {
    trim: true,
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  profilePicture: {
    type: String,
    default: "person.png"
  },
  activityStatus: {
    type: String,
    default: "offline"
  },
  activated: {
    type: Boolean,
    default: false
  },
  postLikes: [postLikeSchema],
  commentLikes: [commentLikeSchema],
  commentReplyLikes: [commentReplyLikeSchema]
});

UserSchema.index({ username: "text", firstName: "text", lastName: "text" });

module.exports = mongoose.model("User", UserSchema);
