const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const app = require("../app");
const sendWhatsApp = require("../utils/sendWhatsApp");

chai.use(chaiHttp);
const { expect } = chai;

describe("WhatsApp API", function () {
  this.timeout(10000);
  let token;

  before(async () => {
    await chai.request(app).post("/api/auth/register").send({
      username: "WhatsApp Tester",
      email: "whatsapp@example.com",
      password: "password123",
    });

    const res = await chai.request(app).post("/api/auth/login").send({
      email: "whatsapp@example.com",
      password: "password123",
    });

    token = res.body.token;
  });

  before(() => {
    sinon.stub(sendWhatsApp, "sendWhatsAppMessage").resolves("mockSid123");
  });

  after(() => {
    sendWhatsApp.sendWhatsAppMessage.restore();
  });

  it("should send WhatsApp message successfully", async () => {
    const res = await chai
      .request(app)
      .post("/api/whatsapp/send-whatsapp")
      .set("Authorization", `Bearer ${token}`)
      .send({
        phone: "+919876543210",
        message: "Hello test WhatsApp",
      });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.message).to.equal("WhatsApp sent");
    expect(res.body.sid).to.equal("mockSid123");
  });

  it("should fail if phone or message is missing", async () => {
    const res = await chai
      .request(app)
      .post("/api/whatsapp/send-whatsapp")
      .set("Authorization", `Bearer ${token}`)
      .send({ phone: "" });

    expect(res.status).to.equal(400);
    expect(res.body.success).to.be.false;
  });

  it("should return 401 if token is invalid", async () => {
    const res = await chai
      .request(app)
      .post("/api/whatsapp/send-whatsapp")
      .set("Authorization", "Bearer invalidtoken")
      .send({
        phone: "+919876543210",
        message: "Hello Invalid Token Test",
      });

    expect(res.status).to.equal(401);
    expect(res.body.success).to.be.false;
  });

  it("should rate limit after 5 requests", async () => {
  const agent = chai.request.agent(app);  // Session isolate

  for (let i = 0; i < 5; i++) {
    await agent
      .post("/api/whatsapp/send-whatsapp")
      .set("Authorization", `Bearer ${token}`)
      .send({
        phone: "+919876543210",
        message: `Test message ${i + 1}`,
      });
  }

  // 6th Request - Use agent here too
  const res = await agent
    .post("/api/whatsapp/send-whatsapp")
    .set("Authorization", `Bearer ${token}`)
    .send({
      phone: "+919876543210",
      message: "This should be rate limited",
    });

  expect(res.status).to.equal(429);
  expect(res.body.message).to.equal("Too many requests from this IP, please try again later.");
});

});
