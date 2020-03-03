const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");

exports.verificationCheck = (req, res, next) => {
  User.aggregate([
    {
      $match: { $or: [{ email: req.body.email }, { username: req.body.email }] }
    },
    {
      $project: {
        password: 1,
        activated: 1
      }
    }
  ])
    .then(users => {
      if (users.length < 1) {
        return res.status(400).json({
          message: "Incorrect credentials."
        });
      } else {
        bcrypt.compare(req.body.password, users[0].password, (err, result) => {
          if (err) {
            return res.status(400).json({
              message: "Incorrect credentials."
            });
          }
          if (result) {
            if (!users[0].activated) {
              return res.status(400).json({ message: "Account not activated" });
            }
            return next();
          }
          return res.status(400).json({ message: "Incorrect credentials." });
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: err });
    });
};
