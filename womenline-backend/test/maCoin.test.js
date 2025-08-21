const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;
const User = require("../models/User");

chai.use(chaiHttp);

let token;

const DUMMY_EMAIL = "maCoin_dummy@test.com";
const DUMMY_PASSWORD = "test123";

describe("MaCoin API", () => {
  before(async function () {
    this.timeout(30000); // give enough time for DB operations

    // Check if the dummy user exists
    let user = await User.findOne({ email: DUMMY_EMAIL });
    if (!user) {
      // Register the dummy user
      const res = await chai
        .request(app)
        .post("/api/auth/register")
        .send({
          username: "maCoinDummyUser",
          email: DUMMY_EMAIL,
          password: DUMMY_PASSWORD,
          phone: "+911234567890", // must include phone for WhatsApp middleware
        });
      token = res.body.token;
    } else {
      // Login existing user to get a token
      const res = await chai
        .request(app)
        .post("/api/auth/login")
        .send({
          email: DUMMY_EMAIL,
          password: DUMMY_PASSWORD,
        });
      token = res.body.token;
    }
  });

  it("should allow a user to earn green credits", (done) => {
    const creditData = {
      activityType: "daily-login",
      source: "app",
    };

    chai
      .request(app)
      .post("/api/earn-credits")
      .set("Authorization", `Bearer ${token}`)
      .send(creditData)
      .end((err, res) => {
        if (err) return done(err);

        // Debug if failing
        if (res.status !== 200) console.log(res.body);

        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data.coinsEarned).to.be.a("number");
        done();
      });
  });

  it("should fail if required fields are missing", (done) => {
    chai
      .request(app)
      .post("/api/earn-credits")
      .set("Authorization", `Bearer ${token}`)
      .send({ activityType: "challenge" }) // missing source
      .end((err, res) => {
        if (err) return done(err);

        expect(res).to.have.status(400);
        expect(res.body.success).to.be.false;
        done();
      });
  });
});
