const mongoose = require("mongoose");
const Notification = mongoose.model("Notification");

exports.readNotifications = (req, res) => {
  Notification.updateMany(
    { _id: { $in: req.body.notificationIds } },
    { $set: { read: true } },
    { multi: true }
  )
    .then(result => {
      res.status(200).json({ read: "notifications" });
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({ msg: err.message });
    });
};

exports.getNotifications = (req, res) => {
  let query;

  if (req.body.initialFetch) {
    query = [
      {
        $facet: {
          notifications: [
            {
              $match: {
                receiver: mongoose.Types.ObjectId(req.userData.userId)
              }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            {
              $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender"
              }
            },
            {
              $lookup: {
                from: "posts",
                localField: "post",
                foreignField: "_id",
                as: "post"
              }
            },
            {
              $lookup: {
                from: "comments",
                localField: "comment",
                foreignField: "_id",
                as: "comment"
              }
            },
            {
              $lookup: {
                from: "replies",
                localField: "reply",
                foreignField: "_id",
                as: "reply"
              }
            },
            {
              $project: {
                _id: 1,
                read: 1,
                message: 1,
                type: 1,
                post: 1,
                comment: 1,
                reply: 1,
                createdAt: 1,
                "sender._id": 1,
                "sender.username": 1,
                "sender.profilePicture": 1
              }
            }
          ],
          total: [
            {
              $match: {
                receiver: mongoose.Types.ObjectId(req.userData.userId)
              }
            },
            { $group: { _id: null, count: { $sum: 1 } } }
          ]
        }
      }
    ];
  } else {
    query = [
      {
        $match: {
          $and: [
            {
              _id: {
                $lt: mongoose.Types.ObjectId(req.body.lastId)
              },
              receiver: mongoose.Types.ObjectId(req.userData.userId)
            }
          ]
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "sender"
        }
      },
      {
        $lookup: {
          from: "posts",
          localField: "post",
          foreignField: "_id",
          as: "post"
        }
      },
      {
        $lookup: {
          from: "comments",
          localField: "comment",
          foreignField: "_id",
          as: "comment"
        }
      },
      {
        $lookup: {
          from: "replies",
          localField: "reply",
          foreignField: "_id",
          as: "reply"
        }
      },
      {
        $project: {
          _id: 1,
          read: 1,
          message: 1,
          type: 1,
          post: 1,
          comment: 1,
          reply: 1,
          createdAt: 1,
          "sender._id": 1,
          "sender.username": 1,
          "sender.profilePicture": 1
        }
      }
    ];
  }

  Notification.aggregate(query)
    .then(data => {
      if (req.body.initialFetch && !data[0].total.length) {
        data[0].total.push({ _id: null, count: 0 }); //if user has no posts
      }

      res.status(200).json({ data });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });

  /*
  Notification.find(query)
    .populate("sender", "username profilePicture")
    .select("-receiver")
    .sort({ createdAt: -1 })
    .limit(5)
    .then(response => res.status(200).json({ notifications: response }))
    .catch(err => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });*/
};
