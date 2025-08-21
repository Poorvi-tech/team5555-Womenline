const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;

const Reward = require("../models/Reward");
const User = require("../models/User");

chai.use(chaiHttp);

let token;
let rewardId;

describe("Reward API", function () {
  this.timeout(25000);

  // Before all tests: register user & create a reward
  before(async () => {
    const random = Math.floor(Math.random() * 10000);
    const userData = {
      username: `rewardUser${random}`,
      email: `reward${random}@test.com`,
      password: "test123",
      phone: "+911234567890",
    };

    // 1️⃣ Register user
    const res = await chai.request(app).post("/api/auth/register").send(userData);
    token = res.body.token;

    // 2️⃣ Update user's greenCredits so they can redeem
    const registeredUser = await User.findOne({ email: userData.email });
    registeredUser.greenCredits = 10; // >= reward cost
    await registeredUser.save();

    // 3️⃣ Create reward
    const reward = new Reward({
      title: "Test Reward",
      description: "Reward for testing",
      cost: 5,
    });
    const savedReward = await reward.save();
    rewardId = savedReward._id.toString();
  });

  it("should fetch available rewards", async () => {
    const res = await chai.request(app).get("/api/rewards");
    expect(res).to.have.status(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.be.an("array");
  });

  it("should redeem reward and log events/audit", async () => {
    const res = await chai
      .request(app)
      .post("/api/rewards/redeem")
      .set("Authorization", `Bearer ${token}`)
      .send({ rewardId });

    expect(res).to.have.status(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.rewardId).to.equal(rewardId);
  });

  it("should fetch user credits", async () => {
    const res = await chai
      .request(app)
      .get("/api/rewards/user-credits")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.greenCredits).to.be.a("number");
  });

  it("should fetch redemption history and log", async () => {
    const res = await chai
      .request(app)
      .get("/api/rewards/user/redemption-history")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.be.an("array");
  });
});
