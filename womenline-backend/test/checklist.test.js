// test/checklist.test.js
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;

chai.use(chaiHttp);

let token;

describe("Doctor Checklist API", function () {
  this.timeout(10000);

  before((done) => {
    // Register a dummy user and get token
    const random = Math.floor(Math.random() * 10000);
    const user = {
      username: `checklistUser${random}`,
      email: `checklist${random}@test.com`,
      password: "test123",
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

  it("should submit a doctor checklist successfully", (done) => {
    const data = {
      userId: "dummyUserId", // Or dynamically fetch from token later
      symptoms: ["Fever", "Cough"],
      duration: "3 days",
    };

    chai
      .request(app)
      .post("/api/checklist")
      .set("Authorization", `Bearer ${token}`)
      .send(data)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.success).to.be.true;
        done();
      });
  });

  it("should return error for missing required fields", (done) => {
    chai
      .request(app)
      .post("/api/checklist")
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.false;
        done();
      });
  });
});
