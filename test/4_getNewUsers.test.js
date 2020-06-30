const expect = require("chai").expect;
const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const { getUser } = require("./data/user");

describe("/api/user/getNewUsers", () => {
  let userId;
  it("getting _id", (done) => {
    const user = {
      ...getUser(0),
    };
    User.findOne({ username: user.username })
      .select("_id")
      .then(({ _id }) => {
        userId = _id;
        done();
      });
  });

  it("should return new users", (done) => {
    request(app)
      .post("/api/user/getNewUsers")
      .send({ initialFetch: true })
      .expect(200)
      .then((res) => {
        expect(res.body).to.have.all.keys("usersCount", "users");
        expect(res.body.users).to.be.an("array");
        expect(res.body.users).to.have.lengthOf(2);
        expect(res.body).to.have.nested.property("users[0]._id");
        expect(res.body).to.have.nested.property("users[0].date");
        expect(res.body).to.have.nested.property("users[0].profilePicture");
        expect(res.body).to.have.nested.property("users[0].username");
        done();
      })
      .catch((err) => done(err));
  });
  it("should require lastId if initialFetch is false", (done) => {
    request(app)
      .post("/api/user/getNewUsers")
      .send({ initialFetch: false })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.all.keys("message");
        expect(res.body.message).to.equal('"lastId" is required');
        done();
      })
      .catch((err) => done(err));
  });

  it("should return user after first one", (done) => {
    request(app)
      .post("/api/user/getNewUsers")
      .send({ initialFetch: false, lastId: userId })
      .expect(200)
      .then((res) => {
        expect(res.body).to.have.all.keys("users");
        expect(res.body.users).to.be.an("array");
        expect(res.body.users).to.have.lengthOf(1);
        expect(res.body).to.have.nested.property("users[0]._id");
        expect(res.body).to.have.nested.property("users[0].date");
        expect(res.body).to.have.nested.property("users[0].profilePicture");
        expect(res.body).to.have.nested.property("users[0].username");
        done();
      })
      .catch((err) => done(err));
  });
});
