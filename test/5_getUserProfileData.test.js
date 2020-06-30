const expect = require("chai").expect;
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const { getUser } = require("./data/user");
const User = require("../models/User");

describe("/api/user/getUserProfileData", () => {
  let tokenJWT;
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

        tokenJWT = "Bearer " + token;

        done();
      });
  });

  it("should return data if jwt is passed and profilePage parameters is true", (done) => {
    const user = {
      ...getUser(1),
    };
    request(app)
      .post("/api/user/getProfilePageData")
      .set("Authorization", tokenJWT)
      .send({ profilePage: true, username: user.username })
      .expect(200)
      .then((res) => {
        expect(res.body.user).to.have.all.keys(
          "_id",
          "bio",
          "firstName",
          "followers",
          "followings",
          "lastName",
          "posts",
          "postsCount",
          "profilePicture",
          "username"
        );
        done();
      })
      .catch((err) => done(err));
  });

  it("should return if user requests its profile", (done) => {
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/getProfilePageData")
      .set("Authorization", tokenJWT)
      .send({ profilePage: true, username: user.username })
      .expect(200)
      .then((res) => {
        expect(res.body.user).to.have.all.keys("loggedInUser");
        done();
      })
      .catch((err) => done(err));
  });

  it("should not return if jwt not passed", (done) => {
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/getProfilePageData")
      .send({ profilePage: true, username: user.username })
      .expect(401)
      .then((res) => {
        expect(res.body).to.have.all.keys("message");
        expect(res.body.message).to.equal("Invalid token");
        done();
      })
      .catch((err) => done(err));
  });
  it("should not return if username not passed", (done) => {
    request(app)
      .post("/api/user/getProfilePageData")
      .set("Authorization", tokenJWT)
      .send({ profilePage: true })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.all.keys("message");
        expect(res.body.message).to.equal('"username" is required');
        done();
      })
      .catch((err) => done(err));
  });

  it("should not return if username not valid", (done) => {
    request(app)
      .post("/api/user/getProfilePageData")
      .set("Authorization", tokenJWT)
      .send({ profilePage: true, username: "123123" })
      .expect(404)
      .then((res) => {
        expect(res.body).to.have.all.keys("message");
        expect(res.body.message).to.equal("User not found");
        done();
      })
      .catch((err) => done(err));
  });
});
