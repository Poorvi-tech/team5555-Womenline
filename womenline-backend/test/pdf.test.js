// test/pdf.test.js
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const fs = require("fs");
const path = require("path");
const expect = chai.expect;

chai.use(chaiHttp);

describe("PDF API", () => {
  it("should generate and download sample PDF", (done) => {
    chai
      .request(app)
      .get("/api/pdf/sample")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.header["content-type"]).to.equal("application/pdf");

        // ✅ Optional: Confirm file was created on disk
        // In pdf.test.js - update path
const filePath = path.join(__dirname, "..", "sample", "health-summary.pdf");

        const fileExists = fs.existsSync(filePath);
        expect(fileExists).to.be.true;

        done();
      });
  });

  it("should generate PDF summary from journal entries", (done) => {
    chai
      .request(app)
      .get("/api/pdf/export-summary")
      .end((err, res) => {
        if (res.status === 404) {
          console.log("ℹ️ No journal entries found for user — skipping PDF export test.");
          expect(res.body.success).to.be.false;
          done();
        } else {
          expect(res).to.have.status(200);
          expect(res.header["content-type"]).to.equal("application/pdf");

          const filePath = path.join(__dirname, "..", "uploads", "summary-report.pdf");
          const fileExists = fs.existsSync(filePath);
          expect(fileExists).to.be.true;

          done();
        }
      });
  });
});
