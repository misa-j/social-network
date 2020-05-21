const userConstants = require("../constants/user");

function generateData(param) {
  const users = [
    {
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      email: "john@edoe.com",
      password: "123",
      retypepassword: "123",
    },
    {
      firstName: "Jane",
      lastName: "Doe",
      username: "janedoe",
      email: "jane@doe.com",
      password: "123",
      retypepassword: "123",
    },
  ];

  switch (param) {
    case userConstants.GET_USER:
      return users[0];
    // DELETE FILEDS
    case userConstants.DELETE_FIRST_NAME:
      delete users[0].firstName;
      return users[0];
    case userConstants.DELETE_LAST_NAME:
      delete users[0].lastName;
      return users[0];
    case userConstants.DELETE_USERNAME:
      delete users[0].username;
      return users[0];
    case userConstants.DELETE_EMAIL:
      delete users[0].email;
      return users[0];
    case userConstants.DELETE_PASSWORD:
      delete users[0].password;
      return users[0];
    case userConstants.DELETE_RETYPE_PASSWORD:
      delete users[0].retypepassword;
      return users[0];
    // EMPTY FILEDS
    case userConstants.EMPTY_FIRST_NAME:
      users[0].firstName = "";
      return users[0];
    case userConstants.EMPTY_LAST_NAME:
      users[0].lastName = "";
      return users[0];
    case userConstants.EMPTY_USERNAME:
      users[0].username = "";
      return users[0];
    case userConstants.EMPTY_EMAIL:
      users[0].email = "";
      return users[0];
    case userConstants.EMPTY_PASSWORD:
      users[0].password = "";
      return users[0];
    case userConstants.EMPTY_RETYPE_PASSWORD:
      users[0].retypepassword = "";
      return users[0];
    // TOO LONG INPUT
    case userConstants.TOOLONG_FIRST_NAME:
      users[0].firstName = "a".repeat(31);
      return users[0];
    case userConstants.TOOLONG_LAST_NAME:
      users[0].lastName = "a".repeat(31);
      return users[0];
    case userConstants.TOOLONG_USERNAME:
      users[0].username = "a".repeat(31);
      return users[0];
    case userConstants.TOOLONG_EMAIL:
      users[0].email = "a".repeat(31) + "@example.com";
      return users[0];
    case userConstants.TOOLONG_PASSWORD:
      users[0].password = "a".repeat(31);
      return users[0];
    case userConstants.TOOLONG_RETYPE_PASSWORD:
      users[0].retypepassword = "a".repeat(31);
      return users[0];
  }
}

module.exports = {
  generateData,
};
