const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const checkAuth = require("../middleware/checkAuth");
const notificationValidator = require("../middleware/schemaValidators/notificationValidator");

router.post(
  "/readNotifications/",
  checkAuth,
  notificationValidator.readNotifications,
  notificationController.readNotifications
);

router.post(
  "/getNotifications/",
  checkAuth,
  notificationValidator.getNotifications,
  notificationController.getNotifications
);

module.exports = router;
