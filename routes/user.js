const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const checkAuth = require("../middleware/checkAuth");
const checkUser = require("../middleware/checkUser");
const checkEmailEnv = require("../middleware/checkEmailEnv");
const userValidator = require("../middleware/schemaValidators/userValidator");
const verificationCheck = require("../middleware/verificationCheck");

router.post("/signup", userValidator.addUser, userController.addUser);

router.post(
  "/login",
  userValidator.loginUser,
  verificationCheck.verificationCheck,
  userController.loginUser,
  userController.sendUserData
);

router.post(
  "/getNewUsers",
  userValidator.getNewUsers,
  userController.getNewUsers
);

router.post(
  "/passwordreset",
  checkAuth,
  userValidator.resetPassword,
  userController.resetPassword
);

router.get("/email/activate/:token", userController.activate);

router.post(
  "/sendVerificationEmail",
  checkEmailEnv,
  userValidator.sendVerificationEmail,
  userController.sendVerificationEmail
);

router.post(
  "/sendforgotPasswordEmail",
  checkEmailEnv,
  userValidator.sendVerificationEmail,
  userController.sendforgotPasswordEmail
);

router.post(
  "/getUserData",
  checkAuth,
  userValidator.getUserData,
  userController.getUserData,
  userController.getUserPosts,
  userController.sendUserData
);

router.post(
  "/getPosts",
  checkAuth,
  userValidator.getPosts,
  userController.getPosts
);

router.post(
  "/getProfilePageData",
  checkAuth,
  userValidator.getUserProfileData,
  userController.getUserProfileData,
  userController.getUserPosts,
  userController.sendUserData
);

router.post(
  "/getUserProfileFollowers",
  checkAuth,
  userValidator.getUserProfileFollowers,
  userController.getUserProfileFollowers
);

router.post(
  "/getUserProfileFollowings",
  checkAuth,
  userValidator.getUserProfileFollowings,
  userController.getUserProfileFollowings
);

router.post(
  "/addProfiePicture",
  checkAuth,
  userController.upload,
  userController.changeProfilePicture
);

router.post(
  "/updateUser",
  checkAuth,
  userValidator.updateUser,
  userController.updateUser
);

router.post(
  "/searchByUsername",
  checkAuth,
  userValidator.searchByUsername,
  userController.searchUsersByUsername
);

router.post(
  "/followUser",
  checkAuth,
  userValidator.followUser,
  checkUser,
  userController.followUser
);

router.post("/delete/", checkAuth, userController.deleteUser);

router.get("/status", userController.healthStatus);

module.exports = router;
