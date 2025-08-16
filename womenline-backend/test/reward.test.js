const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;

const Reward = require("../models/Reward"); // Reward model import
chai.use(chaiHttp);

let token;
let rewardId;

describe("Reward API", function () {
  this.timeout(25000); // Increase timeout

  // Before all tests: register user & create a reward
  before(async () => {
    const random = Math.floor(Math.random() * 10000);
    const user = {
      username: `rewardUser${random}`,
      email: `reward${random}@test.com`,
      password: "test123",
    };

    // Register user
    const res = await chai.request(app).post("/api/auth/register").send(user);
    token = res.body.token;

    // Create reward in DB directly
    const reward = new Reward({
      title: "Test Reward",
      description: "Reward for testing",
      cost: 5,
    });
    const savedReward = await reward.save();
    rewardId = savedReward._id.toString();
  });

  it("should earn green credits via /api/rewards/earn-credits", (done) => {
    const data = {
      activityType: "journal-entry",
      source: "eco_activity",
    };

    chai
      .request(app)
      .post("/api/rewards/earn-credits")
      .set("Authorization", `Bearer ${token}`)
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
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.false;
        done();
      });
  });

  it("should redeem reward and log events/audit", (done) => {
    chai
      .request(app)
      .post("/api/rewards/redeem")
      .set("Authorization", `Bearer ${token}`)
      .send({ rewardId })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data.rewardId).to.equal(rewardId);
        done();
      });
  });

  it("should fetch redemption history and log", (done) => {
    chai
      .request(app)
      .get("/api/rewards/user/redemption-history")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data[0].title).to.equal("Test Reward");
        done();
      });
  });
});
