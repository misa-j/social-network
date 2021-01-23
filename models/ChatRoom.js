const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const ChatRoom = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  roomName: { type: String, default: "" },
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  messages: { type: Number, default: 0 },
});

ChatRoom.statics.getRooms = function (userId) {
  return this.aggregate([
    // Lookup Stores and populate their reviews
    { $match: { members: { $in: [userId] } } },
    {
      $lookup: {
        from: "users",
        localField: "members",
        foreignField: "_id",
        as: "members",
      },
    },
    {
      $lookup: {
        from: "messages",
        as: "lastMessage",
        let: { indicator_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$roomId", "$$indicator_id"] },
            },
          },
          { $sort: { createdAt: -1 } }, // add sort if needed (for example, if you want first 100 comments by creation date)
          { $limit: 1 },
        ],
      },
    },
    // filter for only items that have 2 or more reviews
    //{ $match: { "messages.1": { $exists: true } } },
    // Add the average reviews field
    {
      $project: {
        "members._id": 1,
        "members.firstName": 1,
        "members.lastName": 1,
        "members.username": 1,
        "members.profilePicture": 1,
        "members.activityStatus": 1,
        messages: 1,
        roomName: 1,
        createdAt: 1,
        lastMessage: 1,
        //averageRating: { $avg: { $size: "$messages" } }
      },
    },
    // sort it by our new field, highest reviews first
    { $sort: { "lastMessage.createdAt": -1 } },
    // limit to at most 10
  ]);
};

module.exports = mongoose.model("ChatRoom", ChatRoom);
