const chai = require("chai");
const chaiHttp = require("chai-http");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const forumController = require("../controllers/forumController");
const jwt = require("jsonwebtoken");

chai.use(chaiHttp);
const { expect } = chai;

//  Generate Valid ObjectId for dummy user
const validObjectId = new mongoose.Types.ObjectId();

const app = express();
app.use(bodyParser.json());

// Middleware to simulate auth
app.use((req, res, next) => {
  req.user = { id: validObjectId.toString() }; // Simulate valid ObjectId
  next();
});

// Forum route directly defined here
app.post("/api/forum", forumController.createForumPost);

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
      .post("/api/forum")
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
      .post("/api/forum")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Missing Content" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("error");
        done();
      });
  });
});
