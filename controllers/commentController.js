const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const Comment = mongoose.model("Comment");
const CommentLike = mongoose.model("CommentLike");
const CommentReply = mongoose.model("Reply");
const Notification = mongoose.model("Notification");
const CommentReplyLike = mongoose.model("CommentReplyLike");
const User = mongoose.model("User");
const notificationHandler = require("../handlers/notificationHandler");
const linkify = require("linkifyjs");
require("linkifyjs/plugins/hashtag")(linkify);
require("linkifyjs/plugins/mention")(linkify);

function arrayRemove(array, value) {
  return array.filter(item => {
    return item._id.toString() !== value.toString();
  });
}

exports.addComment = (req, res) => {
  //notificationHandler.sendCommentMentionNotification(req, values);

  const mentions = linkify // find mentions
    .find(req.body.value)
    .filter(link => {
      if (link.type === "mention") {
        return link.value.substring(1);
      }
    })
    .map(hashtag => hashtag.value.substring(1));

  const uniqueUsernames = [...new Set([...mentions])];

  Post.findById({ _id: req.body.postId })
    .then(post => {
      if (!post) {
        return res.status(400).json({ message: "No post with that id" });
      }
      new Comment({
        post: post._id,
        author: req.userData.userId,
        text: req.body.value
      })
        .save()
        .then(comment => {
          comment.populate("author", err => {
            if (err) {
              return res.status(400).json({ message: err.message });
            }
            let notification;

            if (req.userData.userId !== req.body.authorId) {
              notification = new Notification({
                sender: req.userData.userId,
                receiver: req.body.authorId,
                post: req.body.postId,
                comment: comment._id,
                type: "post_comment"
              })
                .save()
                .then(notification => {
                  return notification
                    .populate("comment", "text")
                    .populate("post", "photo")
                    .execPopulate();
                })
                .then(notification => {
                  return notification.toObject();
                });
            }
            const commentLike = new CommentLike({
              comment: comment._id
            }).save();
            const user = User.findById(req.userData.userId).select(
              "profilePicture username"
            );

            User.find({ username: { $in: uniqueUsernames } })
              .select("_id")
              .then(userIds => {
                const removedUserid = arrayRemove(userIds, req.userData.userId);

                new Notification({
                  sender: req.userData.userId,
                  receiver: removedUserid,
                  type: "comment_tagged",
                  post: req.body.postId
                })
                  .save()
                  .then(notification => {
                    notification
                      .populate("post", "photo")
                      .execPopulate()
                      .then(notification => {
                        User.findById(req.userData.userId)
                          .select("profilePicture username")
                          .then(user => {
                            notificationHandler.sendCommentMentionNotification({
                              req,
                              removedUserid,
                              user,
                              notification: notification.toObject()
                            });
                          });
                      });
                  })
                  .catch(err => {
                    console.log(err);
                    res.status(400).json({ message: err.message });
                  });
              })
              .catch(err => {
                console.log(err);
                res.status(400).json({ message: err.message });
              });

            Promise.all([user, notification, commentLike])
              .then(values => {
                notificationHandler.sendAddCommentNotification(req, values);
                const data = {
                  _id: comment._id,
                  author: [
                    {
                      _id: comment.author._id,
                      firstName: comment.author.firstName,
                      lastName: comment.author.lastName,
                      username: comment.author.username,
                      profilePicture: comment.author.profilePicture
                    }
                  ],
                  text: comment.text,
                  createdAt: comment.createdAt,
                  post: comment.post,
                  likes: 0,
                  replies: 0
                };
                res.status(200).json({ comment: data });
              })
              .catch(err => {
                console.log(err);
                res.status(400).json({ message: err.message });
              });
          });
        })
        .catch(err => {
          console.log(err);
          res.status(400).json({ message: err.message });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({ message: err.message });
    });
};

exports.getCommentsForPost = (req, res) => {
  let query;

  if (req.body.initialFetch) {
    query = {
      $match: {
        post: mongoose.Types.ObjectId(req.body.postId)
      }
    };
  } else {
    query = {
      $match: {
        $and: [
          {
            _id: {
              $lt: mongoose.Types.ObjectId(req.body.lastId)
            },
            post: mongoose.Types.ObjectId(req.body.postId)
          }
        ]
      }
    };
  }
  Comment.aggregate([
    query,
    { $sort: { createdAt: -1 } },
    { $limit: 15 },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author"
      }
    },
    {
      $lookup: {
        from: "commentlikes",
        localField: "_id",
        foreignField: "comment",
        as: "likes"
      }
    },
    {
      $lookup: {
        from: "replies",
        localField: "_id",
        foreignField: "commentAt",
        as: "replies"
      }
    },
    {
      $lookup: {
        from: "replies",
        as: "match_docs",
        let: { indicator_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$commentAt", "$$indicator_id"] }
            }
          },
          { $sort: { createdAt: 1 } }, // add sort if needed (for example, if you want first 100 comments by creation date)
          { $limit: 1 }
        ]
      }
    },
    {
      $project: {
        photo: 1,
        createdAt: 1,
        match_docs: 1,
        text: 1,
        likes: {
          $size: { $arrayElemAt: ["$likes.users_likes", 0] }
        },
        replies: {
          $size: "$replies"
        },
        "author._id": 1,
        "author.firstName": 1,
        "author.lastName": 1,
        "author.username": 1,
        "author.profilePicture": 1
      }
    }
  ])
    .then(comments => {
      res.status(200).json({ comments, postId: req.body.postId });
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({ message: err.message });
    });
};

exports.addCommentReply = (req, res) => {
  Comment.findById({ _id: req.body.commentId })
    .then(comment => {
      if (!comment) {
        return res.status(400).json({ message: "No comment with that id" });
      }
      new CommentReply({
        commentAt: comment._id,
        author: req.userData.userId,
        text: req.body.text
      })
        .save()
        .then(comment => {
          comment.populate("author", err => {
            if (err) {
              return res.status(400).json({ message: err.message });
            }

            let notification;

            if (req.userData.userId !== req.body.authorId) {
              notification = new Notification({
                sender: req.userData.userId,
                receiver: req.body.authorId,
                comment: req.body.commentId,
                post: req.body.postId,
                reply: comment._id,
                type: "comment_reply"
              })
                .save()
                .then(notification => {
                  return notification
                    .populate("comment", "text")
                    .populate("reply", "text")
                    .populate("post", "photo")
                    .execPopulate();
                })
                .then(notification => {
                  return notification.toObject();
                });
            }
            const commentReplyLike = new CommentReplyLike({
              comment: comment._id
            }).save();

            const user = User.findById(req.userData.userId).select(
              "profilePicture username"
            );

            Promise.all([user, notification, commentReplyLike])
              .then(values => {
                notificationHandler.sendAddCommentReplyNotification(
                  req,
                  values
                );
                const data = {
                  _id: comment._id,
                  author: [
                    {
                      _id: comment.author._id,
                      firstName: comment.author.firstName,
                      lastName: comment.author.lastName,
                      username: comment.author.username,
                      profilePicture: comment.author.profilePicture
                    }
                  ],
                  text: comment.text,
                  createdAt: comment.createdAt,
                  commentAt: comment.commentAt,
                  likes: 0
                };
                res.status(200).json({ comment: data });
              })
              .catch(err => {
                console.log(err);
                res.status(400).json({ message: err.message });
              });
          });
        })
        .catch(err => {
          console.log(err);
          res.status(400).json({ message: err.message });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({ message: err.message });
    });
};

exports.getRepliesForComment = (req, res) => {
  let query;

  if (req.body.initialFetch) {
    query = {
      $match: {
        commentAt: mongoose.Types.ObjectId(req.body.commentId)
      }
    };
  } else {
    query = {
      $match: {
        $and: [
          {
            _id: {
              $lt: mongoose.Types.ObjectId(req.body.lastId)
            },
            commentAt: mongoose.Types.ObjectId(req.body.commentId)
          }
        ]
      }
    };
  }

  CommentReply.aggregate([
    query,
    { $sort: { createdAt: -1 } },
    { $limit: 1 },
    {
      $project: {
        text: 1,
        createdAt: 1,
        author: 1,
        commentAt: 1
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author"
      }
    },
    {
      $lookup: {
        from: "commentreplylikes",
        localField: "_id",
        foreignField: "comment",
        as: "likes"
      }
    },
    {
      $project: {
        text: 1,
        createdAt: 1,
        commentAt: 1,
        likes: {
          $size: { $arrayElemAt: ["$likes.users_likes", 0] }
        },
        "author._id": 1,
        "author.firstName": 1,
        "author.lastName": 1,
        "author.username": 1,
        "author.profilePicture": 1
      }
    }
  ])
    .then(comments => {
      res.status(200).json({ comments, commentId: req.body.commentId });
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({ message: err.message });
    });
};

exports.likeComment = (req, res) => {
  CommentLike.updateOne(
    {
      comment: req.body.commentId,
      "users_likes.author": { $ne: req.userData.userId }
    },
    {
      $addToSet: { users_likes: { author: req.userData.userId } }
    }
  ).then(document => {
    if (document.nModified === 1) {
      let notification;
      if (req.userData.userId !== req.body.authorId) {
        notification = new Notification({
          sender: req.userData.userId,
          receiver: req.body.authorId,
          comment: req.body.commentId,
          post: req.body.postId,
          type: "like_comment"
        })
          .save()
          .then(notification => {
            return notification
              .populate("post", "photo ")
              .populate("comment", "text ")
              .execPopulate();
          })
          .then(notification => {
            return notification.toObject();
          });
      }

      const user = User.findByIdAndUpdate(
        req.userData.userId,
        { $push: { commentLikes: { comment: req.body.commentId } } },
        { new: true, upsert: true }
      );
      Promise.all([user, notification])
        .then(values => {
          notificationHandler.sendLikeCommenNotification(req, values);

          return res.status(200).json({
            commentId: req.body.commentId,
            postId: req.body.postId,
            action: "liked"
          });
        })
        .catch(err => {
          console.log(err);
          res.status(400).json({ message: err.message });
        });
    } else {
      const commentLike = CommentLike.updateOne(
        { comment: req.body.commentId },
        {
          $pull: { users_likes: { author: req.userData.userId } }
        },
        { new: true, upsert: true }
      );

      const user = User.findByIdAndUpdate(
        req.userData.userId,
        { $pull: { commentLikes: { comment: req.body.commentId } } },
        { new: true, upsert: true }
      );

      Promise.all([commentLike, user])
        .then(values => {
          return res.status(200).json({
            commentId: req.body.commentId,
            postId: req.body.postId,
            action: "disliked"
          });
        })
        .catch(err => {
          console.log(err);
          res.status(400).json({ message: err.message });
        });
    }
  });
};

exports.likeCommentReply = (req, res) => {
  CommentReplyLike.updateOne(
    {
      comment: req.body.commentId,
      "users_likes.author": { $ne: req.userData.userId }
    },
    {
      $addToSet: { users_likes: { author: req.userData.userId } }
    }
  ).then(document => {
    if (document.nModified === 1) {
      let notification;
      if (req.userData.userId !== req.body.authorId) {
        notification = new Notification({
          sender: req.userData.userId,
          receiver: req.body.authorId,
          reply: req.body.commentId,
          post: req.body.postId,
          type: "like_commentReply"
        })
          .save()
          .then(notification => {
            return notification
              .populate("post", "photo")
              .populate("reply", "text")
              .execPopulate();
          })
          .then(notification => {
            return notification.toObject();
          });
      }

      const user = User.findByIdAndUpdate(
        req.userData.userId,
        { $push: { commentReplyLikes: { comment: req.body.commentId } } },
        { new: true, upsert: true }
      );
      Promise.all([user, notification])
        .then(values => {
          notificationHandler.sendLikeCommenReplyNotification(req, values);
          return res.status(200).json({
            commentId: req.body.commentId,
            parentId: req.body.commentAt,
            action: "liked"
          });
        })
        .catch(err => {
          console.log(err);
          res.status(400).json({ message: err.message });
        });
    } else {
      const commentReplyLike = CommentReplyLike.updateOne(
        { comment: req.body.commentId },
        {
          $pull: { users_likes: { author: req.userData.userId } }
        },
        { new: true, upsert: true }
      );

      const user = User.findByIdAndUpdate(
        req.userData.userId,
        { $pull: { commentReplyLikes: { comment: req.body.commentId } } },
        { new: true, upsert: true }
      );

      Promise.all([commentReplyLike, user])
        .then(values => {
          return res.status(200).json({
            commentId: req.body.commentId,
            parentId: req.body.commentAt,
            action: "disliked"
          });
        })
        .catch(err => {
          console.log(err);
          res.status(400).json({ message: err.message });
        });
    }
  });
};

exports.getCommentLikes = (req, res) => {
  CommentLike.find({ comment: req.body.commentId })
    .populate("users_likes.author", "username profilePicture")
    .then(users => {
      res.status(200).json({ users });
    });
};

exports.getCommentReplyLikes = (req, res) => {
  CommentReplyLike.find({ comment: req.body.commentId })
    .populate("users_likes.author", "username profilePicture")
    .then(users => {
      res.status(200).json({ users });
    });
};
