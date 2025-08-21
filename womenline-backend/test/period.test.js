const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;

chai.use(chaiHttp);

let token, userId;

describe("Period Tracker API", () => {
  // Register a test user before running the tests
  before((done) => {
    const random = Math.floor(Math.random() * 10000);
    const user = {
      username: `periodUser${random}`,
      email: `period${random}@test.com`,
      password: "test123",
      phone: `+9112345${random}`, 
    };

    chai
      .request(app)
      .post("/api/auth/register")
      .send(user)
      .end((err, res) => {
        if (err) return done(err);

        if (res.status !== 201) {
          return done(new Error(`Registration failed: ${res.body.message}`));
        }

        token = res.body.token;
        userId = res.body.user?._id;

        if (!userId) return done(new Error("userId not returned"));

        done();
      });
  });

  it("should log a new period", (done) => {
    const periodData = {
      userId,
      startDate: "2024-06-01",
      endDate: "2024-06-05",
      symptoms: ["cramps", "fatigue"],
      mood: "Sad",
      notes: "First period after delivery",
      cycleLength: 28,
    };

    chai
      .request(app)
      .post("/api/period-log")
      .set("Authorization", `Bearer ${token}`)
      .send(periodData)
      .end((err, res) => {
        if (err) return done(err);

        expect(res).to.have.status(201);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.include.all.keys(
          "userId",
          "startDate",
          "endDate",
          "mood",
          "cycleLength"
        );
        done();
      });
  });

  it("should fetch period logs for the user", (done) => {
    chai
      .request(app)
      .get(`/api/period-log/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) return done(err);

        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an("array");
        done();
      });
  });
});
