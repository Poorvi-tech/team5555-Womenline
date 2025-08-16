const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const authController = require("../controllers/authController");

const expect = chai.expect;

chai.use(chaiHttp);

let uniqueUser;

describe("Auth API", () => {
  before(function (done) {
    this.timeout(20000);

    const random = Math.floor(Math.random() * 10000);
    uniqueUser = {
      username: `testuser${random}`,
      email: `test${random}@example.com`,
      password: "test123",
    };

    chai
      .request(app)
      .post("/api/auth/register")
      .send(uniqueUser)
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });

  it("should login the registered user", (done) => {
    chai
      .request(app)
      .post("/api/auth/login")
      .send({
        email: uniqueUser.email,
        password: uniqueUser.password,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
        expect(res.body.user).to.have.property("email", uniqueUser.email);
        done();
      });
  });

  it("should not register a duplicate user", (done) => {
    chai
      .request(app)
      .post("/api/auth/register")
      .send(uniqueUser)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.include("already exists");
        done();
      });
  });

  it("should reject invalid login credentials", (done) => {
    chai
      .request(app)
      .post("/api/auth/login")
      .send({
        email: "invalid@example.com",
        password: "wrongpassword",
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.include("Invalid");
        done();
      });
  });

  it("should send OTP to the user email", (done) => {
    chai
      .request(app)
      .post("/api/auth/send-otp")
      .send({ email: uniqueUser.email })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.include("OTP sent");
        done();
      });
  });

  it("should fail OTP verification with wrong OTP", (done) => {
    chai
      .request(app)
      .post("/api/auth/verify-otp")
      .send({ email: uniqueUser.email, otp: "000000" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.include("Invalid OTP");
        done();
      });
  });

  it("should verify OTP successfully (using in-memory OTP)", (done) => {
    const otpData = authController.otpStore[uniqueUser.email];

    chai
      .request(app)
      .post("/api/auth/verify-otp")
      .send({ email: uniqueUser.email, otp: otpData?.otp })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.include("OTP verified");
        done();
      });
  });
});
