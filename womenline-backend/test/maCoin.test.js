// test/maCoin.test.js
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;

chai.use(chaiHttp);

let token;

describe("MaCoin API", () => {
  before((done) => {
    const random = Math.floor(Math.random() * 10000);
    const user = {
      username: `coinUser${random}`,
      email: `coin${random}@test.com`,
      password: "test123"
    };

    chai
      .request(app)
      .post("/api/auth/register")
      .send(user)
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it("should allow a user to earn green credits", (done) => {
    const creditData = {
      type: "challenge",
      source: "recycled_plastic",
      coins: 10
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
    .post("/api/earn-credits") // ✅ this path must be /api/earn-credits
    .set("Authorization", `Bearer ${token}`)
    .send({ type: "challenge" }) // missing fields
    .end((err, res) => {
      expect(res).to.have.status(400); // ⛔ fails here
      expect(res.body.success).to.be.false;
      done();
    });
});

});
