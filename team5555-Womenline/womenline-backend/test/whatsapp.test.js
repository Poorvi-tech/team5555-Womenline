const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const app = require("../app");
const sendWhatsApp = require("../utils/sendWhatsApp"); // ✅ import once, globally

chai.use(chaiHttp);
const { expect } = chai;

describe("WhatsApp API", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should send WhatsApp message successfully", async () => {
    // ✅ correct stub
    sandbox.stub(sendWhatsApp, "sendWhatsAppMessage").resolves("fake_sid");

    const res = await chai.request(app)
      .post("/api/whatsapp/send-whatsapp")
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
    const res = await chai.request(app)
      .post("/api/whatsapp/send-whatsapp")
      .send({ phone: "" });

    expect(res.status).to.equal(400);
    expect(res.body.success).to.be.false;
  });
});
