const User = require("../../models/User");
const Following = require("../../models/Following");
const Followers = require("../../models/Followers");
const bcrypt = require("bcryptjs");

function getUser(idx) {
  const data = [
    {
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      email: "john@doe.com",
      password: "123",
      retypepassword: "123",
    },
    {
      firstName: "Jane",
      lastName: "Doe",
      username: "janedoe_123",
      email: "jane123@doe.com",
      password: "123",
      retypepassword: "123",
    },
  ];
  return data[idx];
}

function populate() {
  const user = {
    ...getUser(1),
  };
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      console.log(err);
      return;
    }
    const user = new User({
      ...getUser(1),
      activated: false,
      password: hash,
    });

    user.save().then((user) => {
      new Following({ user: user._id }).save();
      new Followers({ user: user._id }).save();
    });
  });
}

module.exports = {
  getUser,
  populate,
};
