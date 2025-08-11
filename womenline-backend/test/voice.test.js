const chai = require("chai");
const chaiHttp = require("chai-http");
const fs = require("fs");
const path = require("path");
const app = require("../app");

chai.use(chaiHttp);
const { expect } = chai;

describe("🎙️ Voice Upload API", () => {
  let token;

  before((done) => {
    const user = {
      username: "testuser",
      email: "testuser@example.com",
      password: "Test@1234",
    };

    // Register user first
    chai
      .request(app)
      .post("/api/auth/register")
      .send(user)
      .end((err, res) => {
        if (err) return done(err);

        // Then login
        chai
          .request(app)
          .post("/api/auth/login")
          .send({ email: user.email, password: user.password })
          .end((err, res) => {
            if (err) return done(err);
            if (!res.body.token) return done(new Error("Login failed, no token returned"));
            token = res.body.token;
            done();
          });
      });
  });

  it("should upload a voice file", (done) => {
    const audioFile = fs.readFileSync(
      path.join(__dirname, "test-files", "test-audio.mp3")
    );

    chai
      .request(app)
      .post("/api/voice/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("voiceFile", audioFile, "test-audio.mp3") // field name must match multer config
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message");
        expect(res.body.success).to.be.true;
        expect(res.body.filePath).to.be.a("string");
        done();
      });
  });

  it("should return error if voice file is missing", (done) => {
    chai
      .request(app)
      .post("/api/voice/upload")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message");
        expect(res.body.success).to.be.false;
        done();
      });
  });
});
