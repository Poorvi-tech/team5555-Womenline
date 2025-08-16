const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

chai.use(chaiHttp);

let userToken;

before(async function() {
  this.timeout(20000);

  const email = "testchecklist@example.com";
  const password = "Password123";

  // Check if test user exists
  let user = await User.findOne({ email });
  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      username: "TestChecklist",
      email,
      password: hashedPassword,
      role: "user",
    });
  }

  // Generate JWT token directly
  userToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
});

describe("User-accessible Doctor Checklist API", () => {
  it("should allow normal user to fetch their own checklist", (done) => {
    chai
      .request(app)
      .get("/api/doctor-checklist")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body.data).to.be.an("array");
        done();
      });
  });
});
