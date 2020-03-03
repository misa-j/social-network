const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const userController = require("../controllers/userController");
const checkAuth = require("../middleware/checkAuth");
const postValidator = require("../middleware/schemaValidators/postValidator");

router.post(
  "/getPosts",
  checkAuth,
  postValidator.getPosts,
  userController.getFollowings,
  postController.getPosts
);

router.post(
  "/getPostsByHashtag",
  checkAuth,
  postValidator.getPostsByHashtag,
  postController.getPostsByHashtag
);

router.post(
  "/getPostLikes",
  checkAuth,
  postValidator.getPostLikes,
  postController.getPostLikes
);

router.post(
  "/getPostsByLocation",
  checkAuth,
  postValidator.getPostsByLocation,
  postController.getPostsByLocation
);

router.post(
  "/addPost",
  checkAuth,
  postController.upload,
  postValidator.createPost,
  postController.createPost
);

router.post(
  "/getPost",
  checkAuth,
  postValidator.getPost,
  postController.getPost
);

router.post(
  "/likePost/",
  checkAuth,
  postValidator.likePost,
  postController.likePost
);

router.post(
  "/delete/",
  checkAuth,
  postValidator.deletePost,
  postController.deletePost
);

module.exports = router;
