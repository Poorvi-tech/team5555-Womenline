// test/checklist.test.js
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;

chai.use(chaiHttp);

let token;

before(function (done) {
  this.timeout(10000); // login के लिए 10 सेकंड timeout

  chai.request(app)
    .post('/api/auth/login')
    .send({
      email: "poorvisahu975@gmail.com",
      password: "password1234"
    })
    .end((err, res) => {
      if (err) return done(err);
      if (!res.body.token) return done(new Error("Login failed - token not returned"));
      token = res.body.token;
      done();
    });
});


describe('Doctor Checklist API', () => {
  it('should submit a doctor checklist successfully', (done) => {
    chai.request(app)
      .post('/api/checklist')
      .set('Authorization', `Bearer ${token}`)
      .send({
        doctorName: "Dr. Test",
        specialization: "General",
        availability: "Mon-Fri",
        contact: "1234567890"
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("success", true);
        done();
      });
  });

  it('should return error for missing required fields', (done) => {
    chai.request(app)
      .post('/api/checklist')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("success", false);
        done();
      });
  });
});
