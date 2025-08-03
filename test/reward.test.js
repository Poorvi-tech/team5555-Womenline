// test/reward.test.js
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;

chai.use(chaiHttp);

let token, userId;

describe("Reward API", () => {
  before((done) => {
    const random = Math.floor(Math.random() * 10000);
    const user = {
      username: `rewardUser${random}`,
      email: `reward${random}@test.com`,
      password: "test123",
    };

    chai
      .request(app)
      .post("/api/auth/register")
      .send(user)
      .end((err, res) => {
        if (err) return done(err);
        token = res.body.token;
        userId = res.body.user?._id || res.body._id || null;

        if (!userId) {
          return done(new Error("userId not returned from registration"));
        }

        done();
      });
  });

  it("should earn green credits via /api/rewards/earn-credits", (done) => {
    const data = {
      userId,
      activityType: "challenge",
      source: "eco_activity",
    };

    chai
      .request(app)
      .post("/api/rewards/earn-credits")
      .send(data)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data.coinsEarned).to.be.a("number");
        done();
      });
  });

  it("should fetch user credits via /api/rewards/user-credits", (done) => {
    chai
      .request(app)
      .get("/api/rewards/user-credits")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data.greenCredits).to.be.a("number");
        done();
      });
  });

  it("should fetch available rewards", (done) => {
    chai
      .request(app)
      .get("/api/rewards")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an("array");
        done();
      });
  });

  it("should fail if required earn-credit fields missing", (done) => {
    chai
      .request(app)
      .post("/api/rewards/earn-credits")
      .send({ activityType: "walk" }) // Missing userId, source
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.false;
        done();
      });
  });
});
