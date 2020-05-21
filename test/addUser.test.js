const expect = require("chai").expect;
const request = require("supertest");
const mongoose = require("mongoose");
const User = require("../models/User");
const Followers = require("../models/Followers");
const Following = require("../models/Following");
const app = require("../app");
const dbHandler = require("./db-handler");
const userConstsnts = require("./constants/user");
const { generateData } = require("./data/user");

before(async () => await dbHandler.connect());

//afterEach(async () => await dbHandler.clearDatabase());

after(async () => {
  await dbHandler.clearDatabase();
  await dbHandler.closeDatabase();
});

describe("/api/user/signup", () => {
  it("should create user", (done) => {
    request(app)
      .post("/api/user/signup")
      .send(generateData(userConstsnts.GET_USER))
      .expect(201)
      .then((res) => {
        expect(res.body).to.have.property("message");
        if (process.env.ENABLE_SEND_EMAIL === "true") {
          expect(res.body.message).to.equal("Verify your email address");
        } else {
          expect(res.body.message).to.equal("Account created");
        }
        done();
      })
      .catch((err) => done(err));
  });

  it("check if documents in collections are created", (done) => {
    const user = generateData(userConstsnts.GET_USER);
    User.find({ username: user.username })
      .select("_id")
      .then((user) => {
        expect(user, "only one user should be created").to.have.lengthOf(1);

        const a = Following.find({ user: user[0]._id });
        const b = Followers.find({ user: user[0]._id });

        Promise.all([a, b])
          .then((documents) => {
            const [doc1, doc2] = documents;
            const userId = user[0]._id.toString();
            const doc1UserId = doc1[0].user.toString();
            const doc2UserId = doc2[0].user.toString();

            expect(
              doc1,
              "one document in Followers should be created"
            ).to.have.lengthOf(1);
            expect(doc1UserId).to.equal(userId);

            expect(
              doc2,
              "one document in Followers should be created"
            ).to.have.lengthOf(1);
            expect(doc2UserId).to.equal(userId);

            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });

  it("should not create user if username exists", (done) => {
    request(app)
      .post("/api/user/signup")
      .send(generateData(userConstsnts.GET_USER))
      .expect(409)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Username exists");
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user if email exists", (done) => {
    request(app)
      .post("/api/user/signup")
      .send({ ...generateData(userConstsnts.GET_USER), username: "janedoe" })
      .expect(409)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Email exists");
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user if username is invalid", (done) => {
    request(app)
      .post("/api/user/signup")
      .send({ ...generateData(userConstsnts.GET_USER), username: "john doe" })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user if username is invalid", (done) => {
    request(app)
      .post("/api/user/signup")
      .send({ ...generateData(userConstsnts.GET_USER), username: "john@doe" })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user if email is invalid", (done) => {
    request(app)
      .post("/api/user/signup")
      .send({ ...generateData(userConstsnts.GET_USER), email: "janedoe.com" })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user if email is invalid", (done) => {
    request(app)
      .post("/api/user/signup")
      .send({ ...generateData(userConstsnts.GET_USER), email: "janedoe@com" })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user if email is invalid", (done) => {
    request(app)
      .post("/api/user/signup")
      .send({ ...generateData(userConstsnts.GET_USER), email: "janedoecom" })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        done();
      })
      .catch((err) => done(err));
  });

  // tests with deleted fileds

  it("should not create user without firstName", (done) => {
    request(app)
      .post("/api/user/signup")
      .send(generateData(userConstsnts.DELETE_FIRST_NAME))
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal('"firstName" is required');
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user without lastName", (done) => {
    request(app)
      .post("/api/user/signup")
      .send(generateData(userConstsnts.DELETE_LAST_NAME))
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal('"lastName" is required');
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user without username", (done) => {
    request(app)
      .post("/api/user/signup")
      .send(generateData(userConstsnts.DELETE_USERNAME))
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal('"username" is required');
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user without email", (done) => {
    request(app)
      .post("/api/user/signup")
      .send(generateData(userConstsnts.DELETE_EMAIL))
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal('"email" is required');
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user without password", (done) => {
    request(app)
      .post("/api/user/signup")
      .send(generateData(userConstsnts.DELETE_PASSWORD))
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal('"password" is required');
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user without retypepassword", (done) => {
    request(app)
      .post("/api/user/signup")
      .send(generateData(userConstsnts.DELETE_RETYPE_PASSWORD))
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal('"retypepassword" is required');
        done();
      })
      .catch((err) => done(err));
  });

  // tests with empty fileds

  it("should not create user if firstname is empty", (done) => {
    request(app)
      .post("/api/user/signup")
      .send(generateData(userConstsnts.EMPTY_FIRST_NAME))
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal(
          '"firstName" is not allowed to be empty'
        );
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user if lastname is empty", (done) => {
    request(app)
      .post("/api/user/signup")
      .send(generateData(userConstsnts.EMPTY_LAST_NAME))
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal(
          '"lastName" is not allowed to be empty'
        );
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user if username is empty", (done) => {
    request(app)
      .post("/api/user/signup")
      .send(generateData(userConstsnts.EMPTY_USERNAME))
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal(
          '"username" is not allowed to be empty'
        );
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user if email is empty", (done) => {
    request(app)
      .post("/api/user/signup")
      .send(generateData(userConstsnts.EMPTY_EMAIL))
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal('"email" is not allowed to be empty');
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user if password is empty", (done) => {
    request(app)
      .post("/api/user/signup")
      .send(generateData(userConstsnts.EMPTY_PASSWORD))
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal(
          '"password" is not allowed to be empty'
        );
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user if retypepassword is empty", (done) => {
    request(app)
      .post("/api/user/signup")
      .send(generateData(userConstsnts.EMPTY_RETYPE_PASSWORD))
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal(
          '"retypepassword" must be [ref:password]'
        );
        done();
      })
      .catch((err) => done(err));
  });

  // tests with too long values

  it("should not create user if firstname is too long", (done) => {
    request(app)
      .post("/api/user/signup")
      .send(generateData(userConstsnts.TOOLONG_FIRST_NAME))
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal(
          '"firstName" length must be less than or equal to 30 characters long'
        );
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user if lastname is too long", (done) => {
    request(app)
      .post("/api/user/signup")
      .send(generateData(userConstsnts.TOOLONG_LAST_NAME))
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal(
          '"lastName" length must be less than or equal to 30 characters long'
        );
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user if username is too long", (done) => {
    request(app)
      .post("/api/user/signup")
      .send(generateData(userConstsnts.TOOLONG_USERNAME))
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal(
          '"username" length must be less than or equal to 30 characters long'
        );
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user if email is too long", (done) => {
    request(app)
      .post("/api/user/signup")
      .send(generateData(userConstsnts.TOOLONG_EMAIL))
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal(
          '"email" length must be less than or equal to 30 characters long'
        );
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user if password is too long", (done) => {
    request(app)
      .post("/api/user/signup")
      .send(generateData(userConstsnts.TOOLONG_PASSWORD))
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal(
          '"password" length must be less than or equal to 30 characters long'
        );
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user if retypepassword is too long", (done) => {
    request(app)
      .post("/api/user/signup")
      .send(generateData(userConstsnts.TOOLONG_RETYPE_PASSWORD))
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal(
          '"retypepassword" must be [ref:password]'
        );
        done();
      })
      .catch((err) => done(err));
  });
});
