const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const Jimp = require("jimp");
const uuidv4 = require("uuid/v4");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const Following = mongoose.model("Following");
const Followers = mongoose.model("Follower");
const Notification = mongoose.model("Notification");
const ChatRoom = mongoose.model("ChatRoom");
const Message = mongoose.model("Message");
const notificationHandler = require("../handlers/notificationHandler");
const emailHandler = require("../handlers/emailHandler");
const messageHandler = require("../handlers/messageHandler");

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
}

const storage = multer.diskStorage({
  //multers disk storage settings
  destination: (req, file, cb) => {
    cb(null, "./public/images/profile-picture/");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];

    cb(null, uuidv4() + "." + ext);
  },
});

const upload = multer({
  //multer settings
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: {
    fileSize: 1024 * 1024,
  },
}).single("photo");

exports.upload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) return res.json({ message: err.message });

    if (!req.file) return res.json({ message: "Please upload a file" });

    req.body.photo = req.file.filename;

    Jimp.read(req.file.path, function (err, test) {
      if (err) throw err;
      test
        .resize(100, 100)
        .quality(50)
        .write("./public/images/profile-picture/100x100/" + req.body.photo);
      next();
    });
  });
};

function deleteProfilePicture({ photo }) {
  fs.unlink("./public/images/profile-picture/" + photo, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("removed");
  });

  fs.unlink("./public/images/profile-picture/100x100/" + photo, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("removed");
  });
}

exports.changeProfilePicture = (req, res) => {
  User.findById(req.userData.userId)
    .select("profilePicture")
    .then((data) => {
      if (data.profilePicture !== "person.png") {
        deleteProfilePicture({ photo: data.profilePicture });
      }

      User.findOneAndUpdate(
        { _id: req.userData.userId },
        { profilePicture: req.body.photo },
        { new: true }
      )
        .select("profilePicture")
        .then((user) => {
          return res.status(200).json({ user });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ message: err.message });
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: err.message });
    });
};

exports.activate = (req, res) => {
  if (process.env.ENABLE_SEND_EMAIL === "false") {
    return res.status(200).header("Content-Type", "text/html")
      .send(`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="theme-color" content="#000000">
        <style>
            .alert {
                padding: 20px;
                background-color: #f44336;
                color: white;
            }
        </style>
        <title>social-network</title>
    </head>
    
    <body>
        <div class="alert">
            <strong>Error!</strong> Disabled.
        </div>
    
    </body>
    
    </html>
  `);
  }

  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_KEY);

    User.findByIdAndUpdate(decoded._id, {
      activated: true,
    })
      .then(() => {
        return res.status(200).header("Content-Type", "text/html")
          .send(`<!DOCTYPE html>
          <html lang="en">
      
          <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
              <meta name="theme-color" content="#000000">
              <style>
                  .alert {
                      padding: 20px;
                      background-color: #4CAF50;
                      color: white;
                  }
              </style>
              <title>social-network</title>
          </head>
          
          <body>
              <div class="alert">
                  <strong>Success!</strong> Account activated.
              </div>
          
          </body>
          
          </html>
          `);
      })
      .catch((err) => {
        console.log(err);
        return res.status(401).header("Content-Type", "text/html")
          .send(`<!DOCTYPE html>
          <html lang="en">
          
          <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
              <meta name="theme-color" content="#000000">
              <style>
                  .alert {
                      padding: 20px;
                      background-color: #f44336;
                      color: white;
                  }
              </style>
              <title>social-network</title>
          </head>
          
          <body>
              <div class="alert">
                  <strong>Error!</strong> Something went wrong.
              </div>
          
          </body>
          
          </html>
        `);
      });
  } catch (err) {
    return res.status(401).header("Content-Type", "text/html")
      .send(`<!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          <meta name="theme-color" content="#000000">
          <style>
              .alert {
                  padding: 20px;
                  background-color: #f44336;
                  color: white;
              }
          </style>
          <title>social-network</title>
      </head>
      
      <body>
          <div class="alert">
              <strong>Error!</strong> Invalid token.
          </div>
      
      </body>
      
      </html>
    `);
  }
};

exports.addUser = (req, res) => {
  User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  }).then((user) => {
    if (!user) {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ error: err });
        } else {
          const user = new User({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: hash,
          });

          user
            .save()
            .then((user) => {
              notificationHandler.sendNewUser({ req, user });
              const following = new Following({ user: user._id }).save();
              const followers = new Followers({ user: user._id }).save();
              Promise.all([following, followers]).then(() => {
                if (process.env.ENABLE_SEND_EMAIL === "true") {
                  emailHandler.sendVerificationEmail({
                    email: user.email,
                    _id: user._id,
                    username: user.username,
                  });
                  return res.status(201).json({
                    message: "Verify your email address",
                  });
                } else {
                  return res.status(201).json({
                    message: "Account created",
                  });
                }
              });
            })
            .catch((err) => {
              return res.status(500).json({ message: err.message });
            });
        }
      });
    } else {
      if (user.username === req.body.username) {
        return res.status(409).json({
          message: "Username exists",
        });
      } else if (user.email === req.body.email) {
        return res.status(409).json({
          message: "Email exists",
        });
      }
    }
  });
};

exports.resetPassword = (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ message: err });
    } else {
      User.findOneAndUpdate({ email: req.userData.email }, { password: hash })
        .then(() => {
          return res.status(200).json({ message: "password reseted" });
        })
        .catch((err) => {
          console.log(err.message);
          return res.status(500).json({ message: err.message });
        });
    }
  });
};

exports.sendVerificationEmail = (req, res) => {
  User.findOne({ email: req.body.email, activated: false })
    .select("email username")
    .then((user) => {
      if (user) {
        emailHandler.sendVerificationEmail(user);
        return res.status(200).json({ message: "Email sent." });
      }
      return res.status(400).json({ message: "Something went wrong." });
    });
};

exports.sendforgotPasswordEmail = (req, res) => {
  console.log(req.body);
  User.findOne({ email: req.body.email })
    .select("email username")
    .then((user) => {
      if (user) {
        emailHandler.sendPasswordResetEmail(user);
        return res.status(200).json({ message: "Email sent." });
      }
      return res.status(400).json({ message: "Something went wrong." });
    });
};

exports.loginUser = (req, res, next) => {
  User.aggregate([
    {
      $match: {
        $or: [{ email: req.body.email }, { username: req.body.email }],
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        email: 1,
        password: 1,
      },
    },
  ])
    .then((users) => {
      if (users.length < 1) {
        return res.status(400).json({
          message: "Incorrect credentials.",
        });
      } else {
        bcrypt.compare(req.body.password, users[0].password, (err, result) => {
          if (err) {
            return res.status(400).json({
              message: "Incorrect credentials.",
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: users[0].email,
                userId: users[0]._id,
                username: users[0].username,
              },
              process.env.JWT_KEY,
              {
                expiresIn: "30m",
              }
            );

            const user = {
              _id: users[0]._id,
              token: "Bearer " + token,
            };
            req.body.user = user;
            next();
            return;
          }
          return res.status(400).json({ message: "Incorrect credentials." });
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err });
    });
};

exports.deleteUser = (req, res) => {
  User.remove({ _id: req.userData.userId }).then((result) => {
    res
      .status(200)
      .json({
        message: "User deleted",
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
};
//{ $match: { $or: [{ email: req.body.email }, { username: req.body.username }], _id: { $not: req.userData.username }} }
exports.updateUser = (req, res) => {
  User.find({
    $and: [
      { $or: [{ email: req.body.email }, { username: req.body.username }] },
      { _id: { $ne: req.userData.userId } },
    ],
  })
    .select("username email")
    .then((user) => {
      if (user.length) {
        const { username, email } = user[0];

        if (username === req.body.username) {
          return res.status(409).json({
            message: "Username exists",
          });
        }

        if (email === req.body.email) {
          return res.status(409).json({
            message: "Email exists",
          });
        }
      } else {
        User.findByIdAndUpdate(
          req.userData.userId,
          {
            ...req.body,
          },
          { new: true }
        )
          .select("firstName lastName username email bio")
          .then((user) => {
            const token = jwt.sign(
              {
                email: user.email,
                userId: user._id,
                username: user.username,
              },
              process.env.JWT_KEY,
              {
                expiresIn: "30m",
              }
            );

            res.status(200).json({ user, token: "Bearer " + token });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ message: err });
          });
      }
    });
};

exports.getUserData = (req, res, next) => {
  const notification = Notification.find({
    receiver: mongoose.Types.ObjectId(req.userData.userId),
    read: false,
  }).countDocuments();

  const allNotification = Notification.find({
    receiver: mongoose.Types.ObjectId(req.userData.userId),
  }).countDocuments();

  const posts = Post.find({
    author: mongoose.Types.ObjectId(req.userData.userId),
  }).countDocuments();

  const messages = Message.find({
    receiver: mongoose.Types.ObjectId(req.userData.userId),
    read: false,
  }).countDocuments();

  const user = User.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(req.userData.userId) } },
    {
      $lookup: {
        from: "followings",
        localField: "_id",
        foreignField: "user",
        as: "followings",
      },
    },
    {
      $lookup: {
        from: "followers",
        localField: "_id",
        foreignField: "user",
        as: "followers",
      },
    },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        username: 1,
        email: 1,
        bio: 1,
        notifications: 1,
        profilePicture: 1,
        followings: {
          $size: { $arrayElemAt: ["$followings.following", 0] },
        },
        followers: {
          $size: { $arrayElemAt: ["$followers.followers", 0] },
        },
        followingIds: { $arrayElemAt: ["$followings.following.user", 0] },
        postLikes: "$postLikes.post",
        commentLikes: "$commentLikes.comment",
        commentReplyLikes: "$commentReplyLikes.comment",
      },
    },
  ]);

  Promise.all([user, notification, posts, messages, allNotification])
    .then((values) => {
      const user = values[0];
      if (user.length < 1) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const data = {
        _id: user[0]._id,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        bio: user[0].bio,
        profilePicture: user[0].profilePicture,
        username: user[0].username,
        email: user[0].email,
        postLikes: user[0].postLikes,
        commentLikes: user[0].commentLikes,
        commentReplyLikes: user[0].commentReplyLikes,
        followings: user[0].followings,
        followers: user[0].followers,
        followingIds: user[0].followingIds || [],
        follwingUsers: [],
        followerUsers: [],
        notificationsCount: values[1],
        postsCount: values[2],
        messagesCount: values[3],
        allNotifications: values[4],
      };
      req.body.user = data;

      next();
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
};

exports.sendUserData = (req, res) => {
  res.status(200).json({ user: req.body.user });
};

exports.followUser = (req, res) => {
  ChatRoom.find({ members: { $all: [req.userData.userId, req.body.userId] } })
    .then((room) => {
      if (!room.length) {
        new ChatRoom({
          members: [req.body.userId, req.userData.userId],
        })
          .save()
          .then((room) => {
            room
              .populate(
                "members",
                "username firstName lastName profilePicture activityStatus"
              )
              .execPopulate()
              .then((room) => {
                messageHandler.sendRoom(req, {
                  userId: req.body.userId,
                  room: room.toObject(),
                });
              });
          });
      }
    })
    .catch((err) => console.log(err.message));

  // if user follows itself
  if (req.userData.userId !== req.body.userId) {
    Following.updateOne(
      {
        user: req.userData.userId,
        "following.user": { $ne: req.body.userId },
      },
      {
        $addToSet: { following: { user: req.body.userId } },
      }
    ).then((document) => {
      if (document.nModified === 1) {
        const notification = new Notification({
          sender: req.userData.userId,
          message: "followed you",
          receiver: req.body.userId,
          type: "follow",
        }).save();

        const followers = Followers.updateOne(
          {
            user: req.body.userId,
          },
          {
            $push: { followers: { user: req.userData.userId } },
          }
        );

        const user = User.findById(req.userData.userId).select(
          "username profilePicture"
        );

        Promise.all([user, notification, followers])
          .then((values) => {
            notificationHandler.sendFollowNotification(req, values);
            return res.status(200).json({
              userId: req.body.userId,
              action: "followed",
            });
          })
          .catch((err) => console.log(err));
      } else {
        const following = Following.updateOne(
          { user: req.userData.userId },
          {
            $pull: { following: { user: req.body.userId } },
          }
        );

        const followers = Followers.updateOne(
          {
            user: req.body.userId,
          },
          {
            $pull: { followers: { user: req.userData.userId } },
          }
        );

        Promise.all([following, followers])
          .then(() => {
            return res.status(200).json({
              userId: req.body.userId,
              action: "unfollowed",
            });
          })
          .catch((err) => console.log(err));
      }
    });
  } else {
    res.status(403).json({ message: "Failed to follow" });
  }
};

exports.getNewUsers = (req, res) => {
  if (req.body.initialFetch) {
    const usersCount = User.find({}).countDocuments();
    const users = User.find()
      .select("username date profilePicture")
      .sort({ date: -1 })
      .limit(30);

    Promise.all([usersCount, users])
      .then((response) => {
        const [usersCount, users] = response;
        res.status(200).json({ usersCount, users });
      })
      .catch((err) => {
        return res.status(500).json({
          message: err.message,
        });
      });
  } else {
    User.find({ _id: { $lt: req.body.lastId } })
      .select("username date profilePicture")
      .sort({ date: -1 })
      .limit(30)
      .then((users) => {
        return res.status(200).json({ users });
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  }
};

exports.getUserProfileData = (req, res, next) => {
  if (req.userData.username === req.body.username) {
    return res.status(200).json({ user: { loggedInUser: true } });
  }

  User.aggregate([
    { $match: { username: req.body.username } },
    {
      $lookup: {
        from: "followings",
        localField: "_id",
        foreignField: "user",
        as: "followings",
      },
    },
    {
      $lookup: {
        from: "followers",
        localField: "_id",
        foreignField: "user",
        as: "followers",
      },
    },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        username: 1,
        email: 1,
        bio: 1,
        profilePicture: 1,
        followings: {
          $size: { $arrayElemAt: ["$followings.following", 0] },
        },
        followers: {
          $size: { $arrayElemAt: ["$followers.followers", 0] },
        },
      },
    },
  ])
    .then((user) => {
      if (user.length < 1) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      Post.find({
        author: mongoose.Types.ObjectId(user[0]._id),
      })
        .countDocuments()
        .then((postsCount) => {
          let data = {
            _id: user[0]._id,
            firstName: user[0].firstName,
            lastName: user[0].lastName,
            profilePicture: user[0].profilePicture,
            username: user[0].username,
            email: user[0].email,
            bio: user[0].bio,
            followings: user[0].followings,
            followers: user[0].followers,
            follwingUsers: [],
            followerUsers: [],
            postsCount,
          };
          req.body.user = data;
          next();
        })
        .catch((err) => {
          res.status(500).json({
            message: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
};

exports.getPosts = (req, res) => {
  Post.aggregate([
    {
      $match: {
        $and: [
          {
            _id: {
              $lt: mongoose.Types.ObjectId(req.body.lastId),
            },
            author: mongoose.Types.ObjectId(req.body.userId),
          },
        ],
      },
    },
    { $sort: { createdAt: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $lookup: {
        from: "postlikes",
        localField: "_id",
        foreignField: "post",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "comments",
      },
    },

    {
      $project: {
        photo: 1,
        createdAt: 1,
        tags: 1,
        passing_scores: 1,
        hashtags: 1,
        location: 1,
        likes: {
          $size: { $arrayElemAt: ["$likes.users_likes", 0] },
        },
        comments: {
          $size: "$comments",
        },
        description: 1,
        "author._id": 1,
        "author.username": 1,
        "author.profilePicture": 1,
      },
    },
  ])
    .then((posts) => {
      return res.status(200).json({ posts });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

exports.getUserPosts = (req, res, next) => {
  Post.aggregate([
    {
      $match: { author: mongoose.Types.ObjectId(req.body.user._id) },
    },
    { $sort: { createdAt: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $lookup: {
        from: "postlikes",
        localField: "_id",
        foreignField: "post",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "comments",
      },
    },
    {
      $project: {
        photo: 1,
        createdAt: 1,
        tags: 1,
        location: 1,
        likes: {
          $size: { $arrayElemAt: ["$likes.users_likes", 0] },
        },
        comments: {
          $size: { $ifNull: ["$comments", []] },
        },
        description: 1,
        "author._id": 1,
        "author.username": 1,
      },
    },
  ])
    .then((posts) => {
      req.body.user.posts = posts;
      next();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
};

exports.searchUsersByUsername = (req, res) => {
  if (req.body.q) {
    User.find({
      $or: [
        { firstName: new RegExp("^" + req.body.q, "i") },
        { lastName: new RegExp("^" + req.body.q, "i") },
        { username: new RegExp("^" + req.body.q, "i") },
      ],
    })
      .limit(10)
      .select("username profilePicture firstName lastName ")
      .then((users) => {
        return res.status(200).json({ users });
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  }
};

exports.getFollowings = (req, res, next) => {
  User.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(req.userData.userId) } },

    {
      $lookup: {
        from: "followings",
        localField: "_id",
        foreignField: "user",
        as: "followings",
      },
    },

    {
      $project: {
        followings: { $arrayElemAt: ["$followings.following.user", 0] },
      },
    },
  ])
    .then((user) => {
      req.body.followings = user[0].followings;
      next();
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

exports.getUserProfileFollowers = (req, res) => {
  Followers.find({ user: mongoose.Types.ObjectId(req.body.userId) })
    .populate("followers.user", "username profilePicture ")
    .select("followers.user")
    .then((users) => {
      return res.status(200).json({ users });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

exports.getUserProfileFollowings = (req, res) => {
  Following.find({ user: mongoose.Types.ObjectId(req.body.userId) })

    .populate("following.user", "username profilePicture ")
    .select("following.user.email")
    .then((users) => {
      return res.status(200).json({ users });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

exports.changeStatus = (userId, clients, io) => {
  if (!clients.length) {
    Followers.find({ user: mongoose.Types.ObjectId(userId) })
      .select("followers.user")
      .then((user) => {
        user[0].followers.forEach((user) => {
          const toUserId = user.user;
          io.sockets.in(toUserId).emit("activityStatusUpdate", {
            activityStatus: "offline",
            user: userId,
          });
        });
      })
      .catch((err) => console.log(err.message));

    Following.find({ user: mongoose.Types.ObjectId(userId) })
      .select("following.user")
      .then((user) => {
        user[0].following.forEach((user) => {
          const toUserId = user.user;
          io.sockets.in(toUserId).emit("activityStatusUpdate", {
            activityStatus: "offline",
            user: userId,
          });
        });
      })
      .catch((err) => console.log(err.message));

    User.findByIdAndUpdate(
      { _id: userId },
      { activityStatus: "offline" },
      { new: true }
    )
      .then(() => {})
      .catch((err) => console.log(err.message));
  } else {
    Followers.find({ user: mongoose.Types.ObjectId(userId) })
      .select("followers.user")
      .then((user) => {
        user[0].followers.forEach((user) => {
          const toUserId = user.user;
          io.sockets.in(toUserId).emit("activityStatusUpdate", {
            activityStatus: "online",
            user: userId,
          });
        });
      })
      .catch((err) => console.log(err.message));

    Following.find({ user: mongoose.Types.ObjectId(userId) })
      .select("following.user")
      .then((user) => {
        user[0].following.forEach((user) => {
          const toUserId = user.user;
          io.sockets.in(toUserId).emit("activityStatusUpdate", {
            activityStatus: "online",
            user: userId,
          });
        });
      })
      .catch((err) => console.log(err.message));

    User.findByIdAndUpdate(
      { _id: userId },
      { activityStatus: "online" },
      { new: true }
    )
      .then(() => {})
      .catch((err) => console.log(err.message));
  }
};
