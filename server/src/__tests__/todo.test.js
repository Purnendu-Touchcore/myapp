const request = require('supertest');

// Set test environment before importing app
process.env.NODE_ENV = 'test';

// Mock mongoose methods to avoid database connection
jest.mock('../models/Todo', () => {
  const mockFind = jest.fn(() => ({
    sort: jest.fn(() => Promise.resolve([]))
  }));
  
  const Todo = function(data) {
    this.title = data.title;
    this.description = data.description || '';
    this.status = data.status || 'pending';
    this.createdAt = new Date();
    this._id = '507f1f77bcf86cd799439011';
    
    this.save = jest.fn(() => Promise.resolve(this));
  };
  
  Todo.find = mockFind;
  Todo.findById = jest.fn();
  Todo.findByIdAndUpdate = jest.fn();
  Todo.findByIdAndDelete = jest.fn();
  Todo.deleteMany = jest.fn(() => Promise.resolve());
  
  return Todo;
});

const app = require('../index');

describe('Todo API', () => {
  describe('GET /api/todos', () => {
    it('should return 200', async () => {
      const res = await request(app).get('/api/todos');
      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/todos', () => {
    it('should return 400 when title is missing', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ description: 'No title' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Title is required');
    });
  });

  describe('Health check', () => {
    it('should return 200 for health endpoint', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('OK');
    });
  });
});
