const expect = require("chai").expect;
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const User = require("../models/User");
const { getUser } = require("./data/user");

describe("/api/user/updateUser", () => {
  let tokenJWT, userId;
  it("getting jwt", (done) => {
    const user = {
      ...getUser(0),
    };
    User.findOne({ username: user.username })
      .select("_id")
      .then(({ _id }) => {
        const token = jwt.sign(
          {
            email: user.email,
            userId: _id,
            username: user.username,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "30m",
          }
        );
        userId = _id;
        tokenJWT = "Bearer " + token;

        done();
      });
  });

  it("should update user", (done) => {
    const user = {
      firstName: "Bob",
      lastName: "Ross",
      username: "bobross",
      email: "bobross@bob.com",
      bio: "",
    };
    request(app)
      .post("/api/user/updateUser")
      .set("Authorization", tokenJWT)
      .send({
        ...user,
      })
      .expect(200)
      .then((res) => {
        expect(res.body).to.have.all.keys("user", "token");
        expect(res.body.user).to.have.all.keys(
          "_id",
          "firstName",
          "lastName",
          "username",
          "email",
          "bio"
        );
        expect(res.body.user.firstName).to.equal(user.firstName);
        expect(res.body.user.lastName).to.equal(user.lastName);
        expect(res.body.user.username).to.equal(user.username);
        expect(res.body.user.email).to.equal(user.email);
        expect(res.body.user.bio).to.equal(user.bio);
        done();
      })
      .catch((err) => done(err));
  });

  it("should not update user if email exists", (done) => {
    const user = {
      firstName: "Bob",
      lastName: "Ross",
      username: "bobross",
      email: getUser(1).email,
      bio: "",
    };
    request(app)
      .post("/api/user/updateUser")
      .set("Authorization", tokenJWT)
      .send({
        ...user,
      })
      .expect(409)
      .then((res) => {
        expect(res.body).to.have.all.keys("message");
        expect(res.body.message).to.equal("Email exists");
        done();
      })
      .catch((err) => done(err));
  });

  it("should not update user if username exists", (done) => {
    const user = {
      firstName: "Bob",
      lastName: "Ross",
      username: getUser(1).username,
      email: "bobross@bob.com",
      bio: "",
    };
    request(app)
      .post("/api/user/updateUser")
      .set("Authorization", tokenJWT)
      .send({
        ...user,
      })
      .expect(409)
      .then((res) => {
        expect(res.body).to.have.all.keys("message");
        expect(res.body.message).to.equal("Username exists");
        done();
      })
      .catch((err) => done(err));
  });

  it("should not update user if username is invalid", (done) => {
    const user = {
      firstName: "Bob",
      lastName: "Ross",
      username: "bob ross",
      email: "bobross@bob.com",
      bio: "",
    };
    request(app)
      .post("/api/user/updateUser")
      .set("Authorization", tokenJWT)
      .send({
        ...user,
      })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.all.keys("message");
        done();
      })
      .catch((err) => done(err));
  });

  it("should not update user if email is invalid", (done) => {
    const user = {
      firstName: "Bob",
      lastName: "Ross",
      username: "bobross",
      email: "bobrossbob.com",
      bio: "",
    };
    request(app)
      .post("/api/user/updateUser")
      .set("Authorization", tokenJWT)
      .send({
        ...user,
      })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.all.keys("message");
        done();
      })
      .catch((err) => done(err));
  });

  it("should not update user if firstName is invalid", (done) => {
    const user = {
      firstName: "B o b",
      lastName: "Ross",
      username: "bobross",
      email: "bobross@bob.com",
      bio: "",
    };
    request(app)
      .post("/api/user/updateUser")
      .set("Authorization", tokenJWT)
      .send({
        ...user,
      })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.all.keys("message");
        done();
      })
      .catch((err) => done(err));
  });

  it("should not update user if lastName is invalid", (done) => {
    const user = {
      firstName: "Bob",
      lastName: "R os s",
      username: "bobross",
      email: "bobross@bob.com",
      bio: "",
    };
    request(app)
      .post("/api/user/updateUser")
      .set("Authorization", tokenJWT)
      .send({
        ...user,
      })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.all.keys("message");
        done();
      })
      .catch((err) => done(err));
  });

  it("should not update user if bio is too long", (done) => {
    const user = {
      firstName: "Bob",
      lastName: "Ross",
      username: "bobross",
      email: "bobross@bob.com",
      bio: "a".repeat(300),
    };
    request(app)
      .post("/api/user/updateUser")
      .set("Authorization", tokenJWT)
      .send({
        ...user,
      })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.all.keys("message");
        expect(res.body.message).to.equal(
          '"bio" length must be less than or equal to 250 characters long'
        );
        done();
      })
      .catch((err) => done(err));
  });

  it("should have not updated user with previous tests", (done) => {
    const user = {
      firstName: "Bob",
      lastName: "Ross",
      username: "bobross",
      email: "bobross@bob.com",
      bio: "",
    };
    User.findById(userId).then(
      ({ firstName, lastName, username, email, bio }) => {
        expect(firstName).to.equal(user.firstName);
        expect(lastName).to.equal(user.lastName);
        expect(username).to.equal(user.username);
        expect(email).to.equal(user.email);
        expect(bio).to.equal(user.bio);
        done();
      }
    );
  });
});
