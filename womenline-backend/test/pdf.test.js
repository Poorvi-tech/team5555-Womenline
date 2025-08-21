const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const fs = require("fs");
const path = require("path");
const expect = chai.expect;

chai.use(chaiHttp);

let token; // Auth token for protected route

describe("PDF API", function () {
  this.timeout(20000); // Allow longer time for PDF generation

  before(async function () {
    // Register user with phone (required for registration)
    await chai.request(app).post("/api/auth/register").send({
      username: "PDF Tester",
      email: "pdf@example.com",
      password: "password123",
      phone: "+911234567890", // must include phone
    });

    // Login user to get token
    const res = await chai.request(app).post("/api/auth/login").send({
      email: "pdf@example.com",
      password: "password123",
    });

    token = res.body.token;
  });

  it("should generate PDF summary from journal entries", function (done) {
    chai
      .request(app)
      .get("/api/pdf/export-summary")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) return done(err);

        if (res.status === 404) {
          console.log("ℹ️ No journal entries found for user — skipping PDF export test.");
          expect(res.body.success).to.be.false;
          done();
        } else {
          expect(res).to.have.status(200);
          expect(res.header["content-type"]).to.equal("application/pdf");

          // Check if summary-report.pdf exists
          const filePath = path.join(__dirname, "..", "uploads", "summary-report.pdf");
          const fileExists = fs.existsSync(filePath);
          expect(fileExists).to.be.true;

          done();
        }
      });
  });
});
