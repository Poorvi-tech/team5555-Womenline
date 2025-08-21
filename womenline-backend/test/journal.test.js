const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;

chai.use(chaiHttp);

let token;

describe("Journal API", () => {
  before(function (done) {
    this.timeout(30000);

    const random = Math.floor(Math.random() * 10000);
    const newUser = {
      username: `journalUser${random}`,
      email: `journal${random}@test.com`,
      password: "test123",
      phone: `+9112345678${random.toString().slice(-2)}`, // required field
    };

    // Step 1: Register user
    chai
      .request(app)
      .post("/api/auth/register")
      .send(newUser)
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(201);

        // Step 2: Login to get JWT token
        chai
          .request(app)
          .post("/api/auth/login")
          .send({ email: newUser.email, password: newUser.password })
          .end((err, res) => {
            if (err) return done(err);
            expect(res).to.have.status(200);
            token = res.body.token; // store JWT token for protected requests
            done();
          });
      });
  });

  it("should create a new journal entry", (done) => {
    chai
      .request(app)
      .post("/api/journals")
      .set("Authorization", `Bearer ${token}`)
      .send({
        mood: "happy",
        note: "Feeling good today.",
        periodDay: 3,
        date: new Date(),
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("data");
        expect(res.body.data).to.have.property("mood", "happy");
        done();
      });
  });

  it("should create a new journal entry with voice note", (done) => {
    chai
      .request(app)
      .post("/api/journals")
      .set("Authorization", `Bearer ${token}`)
      .send({
        mood: "anxious",
        note: "Recorded a voice note.",
        voiceNote: "https://example.com/audio.mp3",
        periodDay: 2,
        date: new Date(),
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("data");
        expect(res.body.data).to.have.property(
          "voiceNote",
          "https://example.com/audio.mp3"
        );
        done();
      });
  });

  it("should fetch all journal entries for the user", (done) => {
    chai
      .request(app)
      .get("/api/journals")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("data");
        expect(res.body.data).to.be.an("array");
        done();
      });
  });
});
