const expect = require("chai").expect;
const request = require("supertest");
const app = require("../app");
const dbHandler = require("./db-handler");
const { getUser, populate } = require("./data/user");
const User = require("../models/User");
const Followers = require("../models/Followers");
const Following = require("../models/Following");

before(async () => {
  await dbHandler.closeDatabase();
  await dbHandler.connect();
  populate();
});

//afterEach(async () => await dbHandler.clearDatabase());

after(async () => {
  await dbHandler.clearDatabase();
  await dbHandler.closeDatabase();
});

describe("/api/user/signup", () => {
  it("should create user", (done) => {
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/signup")
      .send(user)
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
    const user = {
      ...getUser(0),
    };
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
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/signup")
      .send(user)
      .expect(409)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Username exists");
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user if email exists", (done) => {
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/signup")
      .send({ ...user, username: "janedoe" })
      .expect(409)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Email exists");
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user if username is invalid", (done) => {
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/signup")
      .send({ ...user, username: "john doe" })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user if username is invalid", (done) => {
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/signup")
      .send({ ...user, username: "john@doe" })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user if email is invalid", (done) => {
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/signup")
      .send({ ...user, email: "janedoe.com" })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user if email is invalid", (done) => {
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/signup")
      .send({ ...user, email: "janedoe@com" })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user if email is invalid", (done) => {
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/signup")
      .send({ ...user, email: "janedoecom" })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        done();
      })
      .catch((err) => done(err));
  });

  // tests with deleted fileds

  it("should not create user without firstName", (done) => {
    const user = {
      ...getUser(0),
    };
    delete user.firstName;
    request(app)
      .post("/api/user/signup")
      .send(user)
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal('"firstName" is required');
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user without lastName", (done) => {
    const user = {
      ...getUser(0),
    };
    delete user.lastName;
    request(app)
      .post("/api/user/signup")
      .send(user)
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal('"lastName" is required');
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user without username", (done) => {
    const user = {
      ...getUser(0),
    };
    delete user.username;
    request(app)
      .post("/api/user/signup")
      .send(user)
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal('"username" is required');
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user without email", (done) => {
    const user = {
      ...getUser(0),
    };
    delete user.email;
    request(app)
      .post("/api/user/signup")
      .send(user)
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal('"email" is required');
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user without password", (done) => {
    const user = {
      ...getUser(0),
    };
    delete user.password;
    request(app)
      .post("/api/user/signup")
      .send(user)
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal('"password" is required');
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user without retypepassword", (done) => {
    const user = {
      ...getUser(0),
    };
    delete user.retypepassword;
    request(app)
      .post("/api/user/signup")
      .send(user)
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
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/signup")
      .send({ ...user, firstName: "" })
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
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/signup")
      .send({ ...user, lastName: "" })
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
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/signup")
      .send({ ...user, username: "" })
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
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/signup")
      .send({ ...user, email: "" })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal('"email" is not allowed to be empty');
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create user if password is empty", (done) => {
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/signup")
      .send({ ...user, password: "" })
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
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/signup")
      .send({ ...user, retypepassword: "" })
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
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/signup")
      .send({ ...user, firstName: "a".repeat(31) })
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
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/signup")
      .send({ ...user, lastName: "a".repeat(31) })
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
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/signup")
      .send({ ...user, username: "a".repeat(31) })
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
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/signup")
      .send({ ...user, email: "a".repeat(31) })
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
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/signup")
      .send({ ...user, password: "a".repeat(31) })
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
    const user = {
      ...getUser(0),
    };
    request(app)
      .post("/api/user/signup")
      .send({ ...user, retypepassword: "a".repeat(31) })
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
