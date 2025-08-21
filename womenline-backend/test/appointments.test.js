// test/appointments.test.js
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;

chai.use(chaiHttp);

let token, appointmentId;

describe("Appointment API", function () {
  this.timeout(20000); // 10s timeout

  before((done) => {
    const random = Math.floor(Math.random() * 10000);
    const user = {
      username: `appointmentUser${random}`,
      email: `appointment${random}@test.com`,
      password: "test123",
      phone: "+919876543210",
    };

    chai
      .request(app)
      .post("/api/auth/register")
      .send(user)
      .end((err, res) => {
        if (err) return done(err);
        token = res.body.token;
        done();
      });
  });

  it("should create a new appointment", (done) => {
    const data = {
      doctorName: "Dr. Wellness",
      date: "2025-08-10T10:00:00Z",
      timeSlot: "10:00 AM - 10:30 AM",
    };

    chai
      .request(app)
      .post("/api/appointments")
      .set("Authorization", `Bearer ${token}`)
      .send(data)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.have.property("appointmentId");
        appointmentId = res.body.data.appointmentId;
        done();
      });
  });

  it("should fetch all appointments for the user", (done) => {
    chai
      .request(app)
      .get("/api/appointments")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an("array");
        done();
      });
  });

  it("should return error if appointment data is incomplete", (done) => {
    const invalidData = {
      doctorName: "Dr. Incomplete",
    };

    chai
      .request(app)
      .post("/api/appointments")
      .set("Authorization", `Bearer ${token}`)
      .send(invalidData)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.false;
        done();
      });
  });

  it("should cancel an appointment", (done) => {
    chai
      .request(app)
      .delete(`/api/appointments/${appointmentId}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal("Appointment cancelled");
        done();
      });
  });
});
