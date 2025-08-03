const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const fs = require("fs");
const path = require("path");
const expect = chai.expect;

chai.use(chaiHttp);

let token; //  For Auth Token

describe("PDF API", () => {
  before(async () => {
    // Register a user
    await chai.request(app).post("/api/auth/register").send({
      username: "PDF Tester",
      email: "pdf@example.com",
      password: "password123",
    });

    // Login user
    const res = await chai.request(app).post("/api/auth/login").send({
      email: "pdf@example.com",
      password: "password123",
    });

    token = res.body.token; // Save token for use in tests
  });

  it("should generate and download sample PDF", (done) => {
    chai
      .request(app)
      .get("/api/pdf/sample")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.header["content-type"]).to.equal("application/pdf");

        const filePath = path.join(
          __dirname,
          "..",
          "sample",
          "health-summary.pdf"
        );
        const fileExists = fs.existsSync(filePath);
        expect(fileExists).to.be.true;

        done();
      });
  });

  it("should generate PDF summary from journal entries", (done) => {
    chai
      .request(app)
      .get("/api/pdf/export-summary")
      .set("Authorization", `Bearer ${token}`) //  Add token here
      .end((err, res) => {
        if (res.status === 404) {
          console.log(
            "ℹ️ No journal entries found for user — skipping PDF export test."
          );
          expect(res.body.success).to.be.false;
          done();
        } else {
          expect(res).to.have.status(200);
          expect(res.header["content-type"]).to.equal("application/pdf");

          const filePath = path.join(
            __dirname,
            "..",
            "uploads",
            "summary-report.pdf"
          );
          const fileExists = fs.existsSync(filePath);
          expect(fileExists).to.be.true;

          done();
        }
      });
  });
});
