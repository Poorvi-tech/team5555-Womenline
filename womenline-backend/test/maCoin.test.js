const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;
const User = require("../models/User");

chai.use(chaiHttp);

let token;

// Permanent dummy user email
const DUMMY_EMAIL = "maCoin_dummy@test.com";
const DUMMY_PASSWORD = "test123";

describe("MaCoin API", () => {
  before(async function () {
    this.timeout(20000); // extend timeout

    // Check if dummy user exists, else create
    let user = await User.findOne({ email: DUMMY_EMAIL });
    if (!user) {
      const res = await chai
        .request(app)
        .post("/api/auth/register")
        .send({
          username: "maCoinDummyUser",
          email: DUMMY_EMAIL,
          password: DUMMY_PASSWORD,
        });
      token = res.body.token;
    } else {
      // Login existing dummy user
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
      type: "challenge",
      source: "recycled_plastic",
      coins: 10,
    };

    chai
      .request(app)
      .post("/api/earn-credits")
      .set("Authorization", `Bearer ${token}`)
      .send(creditData)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data.greenCredits).to.be.a("number");
        done();
      });
  });

  it("should fail if required fields are missing", (done) => {
    chai
      .request(app)
      .post("/api/earn-credits")
      .set("Authorization", `Bearer ${token}`)
      .send({ type: "challenge" }) // missing coins & source
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.false;
        done();
      });
  });
});
