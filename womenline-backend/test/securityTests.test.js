const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

chai.use(chaiHttp);
const { expect } = chai;

describe('Security Tests', () => {
  let testToken; // Get from auth in real tests

  it('BLOCKS excessive MaCoin earnings', async () => {
    const res = await chai.request(app)
      .post('/api/earn-maCoin')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ amount: 101 });
    expect(res).to.have.status(429);
  });

  it('BLOCKS forum spam', async () => {
    const promises = Array(4).fill().map(() => 
      chai.request(app)
        .post('/api/forum/post')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ message: 'Test' })
    );
    const results = await Promise.all(promises);
    expect(results[3]).to.have.status(429);
  });
});
