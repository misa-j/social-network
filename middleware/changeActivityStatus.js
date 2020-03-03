const mongoose = require("mongoose");
const User = mongoose.model("User");
const Followers = mongoose.model("Follower");
const messageHandler = require("../handlers/messageHandler");

module.exports = (req, res, next) => {
  Followers.find({ user: mongoose.Types.ObjectId(req.body.user._id) })
    .select("followers.user")
    .then(user => {
      user[0].followers.forEach(user => {
        const userId = user.user;
        messageHandler.sendActivityStatus({
          req,
          userId,
          user: req.body.user._id,
          activityStatus: "online"
        });
      });
    })
    .catch(err => {
      console.log(err.message);
      return res.status(500).json({ message: err.message });
    });
  User.findByIdAndUpdate(
    { _id: mongoose.Types.ObjectId(req.body.user._id) },
    { activityStatus: "online" },
    { new: true }
  )
    .select("activityStatus username")
    .then(user => {
      next();
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });
};
