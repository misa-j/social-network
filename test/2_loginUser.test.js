const expect = require("chai").expect;
const request = require("supertest");
const app = require("../app");
const { getUser } = require("./data/user");

describe("/api/user/login", () => {
  it("should get jwt if correct credentials are passed", (done) => {
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/login")
      .send({ email: user.email, password: user.password })
      .expect(200)
      .then((res) => {
        expect(res.body.user).to.have.all.keys("_id", "token");
        expect(res.body.user.token).to.have.string("Bearer");
        done();
      })
      .catch((err) => done(err));
  });

  it("should not get jwt if wrong credentials is passed", (done) => {
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/login")
      .send({ email: "asdasd", password: user.password })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.all.keys("message");
        done();
      })
      .catch((err) => done(err));
  });
  it("should not get jwt if no email is passed", (done) => {
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/login")
      .send({ password: user.password })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.all.keys("message");
        expect(res.body.message).to.equal('"email" is required');
        done();
      })
      .catch((err) => done(err));
  });

  it("should not get jwt if no password is passed", (done) => {
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/login")
      .send({ email: user.email })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.all.keys("message");
        expect(res.body.message).to.equal('"password" is required');
        done();
      })
      .catch((err) => done(err));
  });

  it("should not get jwt if user not activated", (done) => {
    const user = {
      ...getUser(1),
    };
    request(app)
      .post("/api/user/login")
      .send({ email: user.email, password: user.password })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.all.keys("message");
        expect(res.body.message).to.equal("Account not activated");
        done();
      })
      .catch((err) => done(err));
  });
});
