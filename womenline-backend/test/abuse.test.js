const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const jwt = require("jsonwebtoken");
const expect = chai.expect;

chai.use(chaiHttp);

let token;

describe(" Abuse Reporting API", function () {
  this.timeout(10000); // Increase timeout (DB + API latency)

  // Register & Login before running tests
  before(async function () {
    const user = {
      username: "Abuse Tester",
      email: "abuse@example.com",
      password: "password123",
    };

    // Register User
    await chai.request(app).post("/api/auth/register").send(user);

    // Login to get JWT Token
    const loginRes = await chai
      .request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: user.password });

    token = loginRes.body.token;
  });

  // Test 1: Successful Abuse Report
  it("should successfully report abuse", async () => {
    const res = await chai
      .request(app)
      .post("/api/abuse/report-abuse")
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "This is a test abuse report" });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property(
      "message",
      "Abuse reported successfully."
    );
  });

  // Test 2: Error on Missing Fields
  it("should return error for missing message", async () => {
    const res = await chai
      .request(app)
      .post("/api/abuse/report-abuse")
      .set("Authorization", `Bearer ${token}`)
      .send({ reportedBy: "testuser" });

    expect(res).to.have.status(400);
    expect(res.body).to.have.property("error");
  });

  // Test 3: Fetch All Abuse Reports (Admin/User)
  it("should fetch all abuse reports (as admin or user)", async () => {
    const res = await chai
      .request(app)
      .get("/api/abuse/report-abuse")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });
});
