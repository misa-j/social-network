const mongoose = require("mongoose");
const ChatRoom = mongoose.model("ChatRoom");
const Message = mongoose.model("Message");
const User = mongoose.model("User");
const messageHandler = require("../handlers/messageHandler");
const path = require("path");
const uuidv4 = require("uuid/v4");
const multer = require("multer");

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
    cb(null, "./public/images/chat-images/");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, uuidv4() + "." + ext);
  }
});

const upload = multer({
  //multer settings
  storage: storage,
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
    messageHandler.sendImageMessageRequest(req, {
      message: {
        sender: req.userData.userId,
        value: "Image",
        roomId: req.body.roomId,
        uuid: req.body.uuid
      },
      receiver: JSON.parse(req.body.receiver)
    });
  },
  limits: {
    fileSize: 10485760 //10 MB
  }
}).single("photo");

exports.upload = (req, res, next) => {
  upload(req, res, err => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    req.body.photo = req.file.filename;
    next();
  });
};

exports.createImageMessage = (req, res) => {
  new Message({
    roomId: req.body.roomId,
    sender: req.userData.userId,
    receiver: JSON.parse(req.body.receiver)._id,
    photo: req.body.photo,
    messageType: "image"
  })
    .save()
    .then(result => {
      ChatRoom.findByIdAndUpdate(
        { _id: req.body.roomId },
        { $inc: { messages: 1 } }
      )
        .then(result => console.log(result))
        .catch(err => {
          console.log(err.message);
        });
      messageHandler.sendImageMessage(req, {
        message: { ...result.toObject(), uuid: req.body.uuid },
        receiver: JSON.parse(req.body.receiver)
      });
      res
        .status(200)
        .json({ message: { ...result.toObject(), uuid: req.body.uuid } });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });
};

exports.getChatRooms = (req, res) => {
  ChatRoom.getRooms(mongoose.Types.ObjectId(req.userData.userId))
    .then(rooms => {
      res.status(200).json({ rooms });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });
};

exports.getMessagesForRoom = (req, res) => {
  let query = null;
  if (req.body.initialFetch) {
    query = { roomId: req.body._id };
  } else {
    query = {
      $and: [
        {
          _id: {
            $lt: req.body.lastId
          },
          roomId: req.body._id
        }
      ]
    };
  }
  Message.find(query)
    .limit(50)
    .sort({ createdAt: -1 })
    .then(result => {
      res.status(200).json({ messages: result });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });
};

exports.sendMessage = (req, res) => {
  new Message({
    roomId: req.body.roomId,
    sender: req.userData.userId,
    text: req.body.value,
    receiver: req.body.receiver._id,
    messageType: "text"
  })
    .save()
    .then(result => {
      ChatRoom.findByIdAndUpdate(
        { _id: req.body.roomId },
        { $inc: { messages: 1 } }
      )
        .then(result => console.log(result))
        .catch(err => {
          console.log(err.message);
        });
      messageHandler.sendMessage(req, {
        message: { ...result.toObject() },
        receiver: req.body.receiver
      });
      res
        .status(200)
        .json({ message: { ...result.toObject(), uuid: req.body.uuid } });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });
};

exports.readMessages = (req, res) => {
  const receiverId = req.room.members.filter(
    member => member.toString().trim() !== req.userData.userId.toString().trim()
  );
  Message.updateMany(
    {
      _id: { $in: req.body.messageIds },
      receiver: mongoose.Types.ObjectId(req.userData.userId)
    },
    { $set: { read: true } },
    { multi: true }
  )
    .then(() => {
      messageHandler.sendReadMessage(req, {
        messageIds: req.body.messageIds,
        receiver: receiverId[0],
        roomId: req.room._id
      });
      res.status(200).json({ read: "messages" });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ msg: err.message });
    });
};

exports.handleCall = (req, res) => {
  User.findById(req.userData.userId)
    .select("profilePicture username")
    .then(user => {
      messageHandler.handleCall(req, {
        room: { ...req.body.currentRoom },
        webRtc: req.body.webRtc,
        caller: { ...user.toObject() }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ msg: err.message });
    });

  res.status(200).json({});
};

exports.answer = (req, res) => {
  const userId = req.room.members.filter(
    userId => userId.toString().trim() !== req.userData.userId.toString().trim()
  );
  messageHandler.handleAnswer(req, {
    userId,
    webRtc: req.body.webRtc
  });
  res.status(200).json({});
};
