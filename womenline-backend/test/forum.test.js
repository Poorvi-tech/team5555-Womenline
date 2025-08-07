const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = require("../app");  // <-- Use actual app.js

chai.use(chaiHttp);
const { expect } = chai;

// Generate Valid ObjectId for dummy user
const validObjectId = new mongoose.Types.ObjectId();

describe("💬 Forum API", () => {
  let token;

  before(() => {
    token = jwt.sign(
      { id: validObjectId.toString() },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );
  });

  it("✅ should create a new forum post", (done) => {
    chai
      .request(app)
      .post("/api/forum/forum-post")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Title", content: "Test Content" })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("postId");
        expect(res.body).to.have.property("createdAt");
        done();
      });
  });

  it("❌ should return error if content is missing", (done) => {
    chai
      .request(app)
      .post("/api/forum/forum-post")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Missing Content" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("error");
        done();
      });
  });
});

describe("Forum API RBAC Tests", () => {
  it("should deny access to post a forum reply without token", async () => {
    const res = await chai
      .request(app)
      .post("/api/forum/forum-reply/1")
      .send({ reply: "This is a test reply without token" });

    expect(res).to.have.status(401);
    expect(res.body.message).to.equal("No token provided");
  });
});
