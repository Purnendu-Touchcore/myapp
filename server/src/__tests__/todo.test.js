const request = require('supertest');

// Set test environment before importing app
process.env.NODE_ENV = 'test';

// Mock mongoose methods to avoid database connection
const mockTodos = [];

jest.mock('../models/Todo', () => {
  const mockFind = jest.fn(() => ({
    sort: jest.fn(() => Promise.resolve(mockTodos))
  }));
  
  const Todo = function(data) {
    this.title = data.title;
    this.description = data.description || '';
    this.status = data.status || 'pending';
    this.createdAt = new Date();
    this._id = '507f1f77bcf86cd799439011';
    
    this.save = jest.fn(() => {
      const savedTodo = { ...this };
      mockTodos.unshift(savedTodo);
      return Promise.resolve(savedTodo);
    });
  };
  
  Todo.find = mockFind;
  Todo.findById = jest.fn();
  Todo.findByIdAndUpdate = jest.fn();
  Todo.findByIdAndDelete = jest.fn();
  Todo.deleteMany = jest.fn(() => Promise.resolve());
  
  return Todo;
});

const app = require('../index');
const Todo = require('../models/Todo');

describe('Todo API', () => {
  beforeEach(() => {
    // Reset mock data before each test
    mockTodos.length = 0;
    jest.clearAllMocks();
  });

  describe('GET /api/todos', () => {
    it('should return 200 and empty array when no todos exist', async () => {
      const res = await request(app).get('/api/todos');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return todos sorted by createdAt descending', async () => {
      const mockTodoData = [
        { _id: '1', title: 'Todo 1', description: '', status: 'pending', createdAt: '2025-01-01T10:00:00.000Z' },
        { _id: '2', title: 'Todo 2', description: 'Desc 2', status: 'completed', createdAt: '2025-01-01T11:00:00.000Z' }
      ];
      
      Todo.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockTodoData)
      });

      const res = await request(app).get('/api/todos');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockTodoData);
      expect(Todo.find().sort).toHaveBeenCalledWith({ createdAt: -1 });
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

    it('should return 400 when title is empty string', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ title: '   ', description: 'Empty title' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Title is required');
    });

    it('should create todo successfully with title only', async () => {
      const todoData = { title: 'Test Todo' };
      
      const res = await request(app)
        .post('/api/todos')
        .send(todoData);

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Test Todo');
      expect(res.body.description).toBe('');
      expect(res.body.status).toBe('pending');
      expect(res.body._id).toBeDefined();
      expect(res.body.createdAt).toBeDefined();
    });

    it('should create todo successfully with title and description', async () => {
      const todoData = { title: 'Test Todo', description: 'Test description' };
      
      const res = await request(app)
        .post('/api/todos')
        .send(todoData);

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Test Todo');
      expect(res.body.description).toBe('Test description');
      expect(res.body.status).toBe('pending');
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should return 400 for invalid ObjectId', async () => {
      const res = await request(app)
        .put('/api/todos/invalid-id')
        .send({ title: 'Updated Title' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid todo ID');
    });

    it('should return 400 for invalid status', async () => {
      const res = await request(app)
        .put('/api/todos/507f1f77bcf86cd799439011')
        .send({ status: 'invalid-status' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid status. Must be "pending" or "completed"');
    });

    it('should return 404 when todo not found', async () => {
      Todo.findByIdAndUpdate.mockResolvedValue(null);

      const res = await request(app)
        .put('/api/todos/507f1f77bcf86cd799439011')
        .send({ title: 'Updated Title' });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Todo not found');
    });

    it('should update todo successfully', async () => {
      const updatedTodo = {
        _id: '507f1f77bcf86cd799439011',
        title: 'Updated Title',
        description: 'Updated Description',
        status: 'completed',
        createdAt: '2025-01-01T10:00:00.000Z'
      };
      
      Todo.findByIdAndUpdate.mockResolvedValue(updatedTodo);

      const res = await request(app)
        .put('/api/todos/507f1f77bcf86cd799439011')
        .send({ title: 'Updated Title', description: 'Updated Description', status: 'completed' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(updatedTodo);
      expect(Todo.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { title: 'Updated Title', description: 'Updated Description', status: 'completed' },
        { new: true, runValidators: true }
      );
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should return 400 for invalid ObjectId', async () => {
      const res = await request(app).delete('/api/todos/invalid-id');

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid todo ID');
    });

    it('should return 404 when todo not found', async () => {
      Todo.findByIdAndDelete.mockResolvedValue(null);

      const res = await request(app).delete('/api/todos/507f1f77bcf86cd799439011');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Todo not found');
    });

    it('should delete todo successfully', async () => {
      const deletedTodo = {
        _id: '507f1f77bcf86cd799439011',
        title: 'To be deleted',
        description: '',
        status: 'pending',
        createdAt: new Date()
      };
      
      Todo.findByIdAndDelete.mockResolvedValue(deletedTodo);

      const res = await request(app).delete('/api/todos/507f1f77bcf86cd799439011');

      expect(res.status).toBe(204);
      expect(res.body).toEqual({});
      expect(Todo.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });

  describe('Health check', () => {
    it('should return 200 for health endpoint', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('OK');
      expect(res.body.message).toBe('Server is running');
    });
  });
});
