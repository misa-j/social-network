const mongoose = require("mongoose");
const ChatRoom = mongoose.model("ChatRoom");

module.exports = (req, res, next) => {
  ChatRoom.find({
    members: { $in: mongoose.Types.ObjectId(req.userData.userId) },
    _id: mongoose.Types.ObjectId(req.body.roomId)
  })
    .then(rooms => {
      if (rooms.length) {
        req.room = rooms[0];
        next();
      } else {
        return res.status(500).json({
          message: "Invalid room"
        });
      }
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });
};
