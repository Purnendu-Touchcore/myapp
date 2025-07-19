const request = require('supertest');
const app = require('../index');
describe('Todo API', () => {
  it('should return 200 for GET /todos', async () => {
    const res = await request(app).get('/todos');
    expect(res.status).toBe(200);
  });
});
