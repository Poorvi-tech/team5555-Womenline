// test/forum.test.js
const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");
const ForumPost = require("../models/ForumPost");
const jwt = require("jsonwebtoken");

chai.use(chaiHttp);
const { expect } = chai;

describe("Forum API", function () {
  this.timeout(25000);

  let testUser, userToken, postId;

  before(async () => {
    console.log("🔌 Connecting to DB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Database connected");

    // Clean up test users and posts
    await User.deleteMany({});
    await ForumPost.deleteMany({});

    // Create test user
    testUser = await User.create({
      username: "Poorvi",
      email: "poorvi@example.com",
      password: "password123",
      phone: "+919876543210",
    });
    console.log("🧑 Test user created:", testUser._id);

    // Generate JWT
    userToken = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log("🔑 JWT token generated for test user");
  });

  after(async () => {
    // Clean up
    await User.deleteMany({});
    await ForumPost.deleteMany({});
    await mongoose.connection.close();
    console.log("🗑 Test DB cleaned and connection closed");
  });

  // POST /api/forum-post
  describe("POST /api/forum-post", () => {
    it("should create a new forum post", async () => {
      const res = await chai
        .request(app)
        .post("/api/forum/forum-post")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ title: "Test Post", content: "This is a test forum post" });
      console.log("💬 createForumPost response:", res.body);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("postId");
      postId = res.body.postId;
    });

    it("should not create post without content", async () => {
      const res = await chai
        .request(app)
        .post("/api/forum/forum-post")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ title: "No Content Post" });
      console.log("💬 createForumPost empty content response:", res.body);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("error");
    });
  });

  // POST /api/forum-reply/:postId
  describe("POST /api/forum-reply/:postId", () => {
    it("should add a reply to the forum post", async () => {
      const res = await chai
        .request(app)
        .post(`/api/forum/forum-reply/${postId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ reply: "This is a test reply" });
      console.log("💬 addForumReply response:", res.body);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("replies");
      expect(res.body.replies).to.be.an("array").that.is.not.empty;
    });

    // it("should not add empty reply", async () => {
    //   const res = await chai
    //     .request(app)
    //     .post(`/api/forum/forum-reply/${postId}`)
    //     .set("Authorization", `Bearer ${userToken}`)
    //     .send({});
    //   console.log("💬 addForumReply empty response:", res.body);

    //   expect(res).to.have.status(400);
    //   expect(res.body).to.have.property("error");
    // });
  });

  // GET /api/forum-replies/:postId
  describe("GET /api/forum-replies/:postId", () => {
    it("should fetch all replies for a forum post", async () => {
      const res = await chai
        .request(app)
        .get(`/api/forum/forum-replies/${postId}`)
        .set("Authorization", `Bearer ${userToken}`);
      console.log("💬 getForumReplies response:", res.body);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("replies");
      expect(res.body.replies).to.be.an("array");
    });
  });

  // POST /api/report-post/:postId
  describe("POST /api/report-post/:postId", () => {
    it("should report a forum post", async () => {
      const res = await chai
        .request(app)
        .post(`/api/forum/report-post/${postId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ reason: "Inappropriate content" });
      console.log("💬 reportPost response:", res.body);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("message");
    });

    it("should not report without reason", async () => {
      const res = await chai
        .request(app)
        .post(`/api/forum/report-post/${postId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({});
      console.log("💬 reportPost empty reason response:", res.body);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("error");
    });
  });

  // GET /api/reports (admin only) → SKIPPED because no admin exists
  describe("GET /api/reports", () => {
    it.skip("should fetch all reported posts (admin only)", () => {
      console.log(
        "⚠️ Skipping admin-only reports test because no admin user exists"
      );
    });
  });
});
