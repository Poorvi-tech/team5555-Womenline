const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const app = require("../app");
const sendWhatsApp = require("../utils/sendWhatsApp");

chai.use(chaiHttp);
const { expect } = chai;

describe("WhatsApp API", () => {
  let sandbox;
  let token;

  before(async () => {
    // Register user
    await chai.request(app).post("/api/auth/register").send({
      username: "WhatsApp Tester",
      email: "whatsapp@example.com",
      password: "password123",
    });

    // Login user
    const res = await chai.request(app).post("/api/auth/login").send({
      email: "whatsapp@example.com",
      password: "password123",
    });

    token = res.body.token; // Get token
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should send WhatsApp message successfully", async () => {
    sandbox.stub(sendWhatsApp, "sendWhatsAppMessage").resolves("fake_sid");

    const res = await chai
      .request(app)
      .post("/api/whatsapp/send-whatsapp")
      .set("Authorization", `Bearer ${token}`) // Real token from DB
      .send({
        phone: "+919876543210",
        message: "Hello test WhatsApp",
      });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.message).to.equal("WhatsApp sent");
    expect(res.body.sid).to.equal("fake_sid");
  });

  it("should fail if phone or message is missing", async () => {
    const res = await chai
      .request(app)
      .post("/api/whatsapp/send-whatsapp")
      .set("Authorization", `Bearer ${token}`) // Token added
      .send({ phone: "" });

    expect(res.status).to.equal(400);
    expect(res.body.success).to.be.false;
  });
});
