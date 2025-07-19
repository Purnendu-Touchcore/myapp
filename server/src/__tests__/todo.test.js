const request = require('supertest');
const app = require('../index');

// Mock mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue({}),
  connection: {
    close: jest.fn().mockResolvedValue({}),
  },
  Schema: jest.fn().mockImplementation(() => ({})),
  model: jest.fn(),
}));

// Mock the Todo model
const mockTodos = [];
const mockTodo = {
  find: jest.fn(() => ({
    sort: jest.fn().mockResolvedValue(mockTodos),
  })),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  deleteMany: jest.fn().mockResolvedValue({}),
  save: jest.fn(),
};

jest.mock('../models/Todo', () => jest.fn().mockImplementation((data) => ({
  ...data,
  _id: 'mock-id',
  createdAt: new Date(),
  save: jest.fn().mockResolvedValue({
    _id: 'mock-id',
    ...data,
    createdAt: new Date(),
  }),
})));

// Mock the Todo model static methods
beforeEach(() => {
  mockTodos.length = 0;
  // eslint-disable-next-line global-require
  // eslint-disable-next-line global-require
      const Todo = require('../models/Todo');
  Object.assign(Todo, mockTodo);
});

describe('Todo API', () => {
  describe('GET /api/todos', () => {
    it('should return 200 and empty array when no todos exist', async () => {
      // eslint-disable-next-line global-require
      // eslint-disable-next-line global-require
      const Todo = require('../models/Todo');
      Todo.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([]),
      });

      const res = await request(app).get('/api/todos');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return all todos', async () => {
      // eslint-disable-next-line global-require
      // eslint-disable-next-line global-require
      const Todo = require('../models/Todo');
      const mockTodoList = [
        {
          _id: '1', title: 'Test Todo 1', description: 'Description 1', status: 'pending',
        },
        {
          _id: '2', title: 'Test Todo 2', description: 'Description 2', status: 'completed',
        },
      ];

      Todo.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockTodoList),
      });

      const res = await request(app).get('/api/todos');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body).toEqual(mockTodoList);
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const todoData = {
        title: 'New Todo',
        description: 'New Description',
      };

      const res = await request(app)
        .post('/api/todos')
        .send(todoData);

      expect(res.status).toBe(201);
      expect(res.body.title).toBe(todoData.title);
      expect(res.body.description).toBe(todoData.description);
      expect(res.body._id).toBeDefined(); // eslint-disable-line no-underscore-dangle
    });

    it('should return 400 if title is missing', async () => {
      const todoData = {
        description: 'Description without title',
      };

      const res = await request(app)
        .post('/api/todos')
        .send(todoData);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Title is required');
    });

    it('should return 400 if title is empty string', async () => {
      const todoData = {
        title: '   ',
        description: 'Description',
      };

      const res = await request(app)
        .post('/api/todos')
        .send(todoData);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Title is required');
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update a todo', async () => {
      // eslint-disable-next-line global-require
      const Todo = require('../models/Todo');
      const updatedTodo = {
        _id: 'test-id',
        title: 'Updated Title',
        description: 'Updated Description',
        status: 'completed',
      };

      Todo.findByIdAndUpdate.mockResolvedValue(updatedTodo);

      const res = await request(app)
        .put('/api/todos/test-id')
        .send({
          title: 'Updated Title',
          description: 'Updated Description',
          status: 'completed',
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(updatedTodo);
    });

    it('should return 404 for non-existent todo', async () => {
      // eslint-disable-next-line global-require
      const Todo = require('../models/Todo');
      Todo.findByIdAndUpdate.mockResolvedValue(null);

      const res = await request(app)
        .put('/api/todos/nonexistent-id')
        .send({ title: 'Updated' });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Todo not found');
    });

    it('should return 400 for invalid status', async () => {
      const res = await request(app)
        .put('/api/todos/test-id')
        .send({ status: 'invalid-status' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid status value');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete a todo', async () => {
      // eslint-disable-next-line global-require
      const Todo = require('../models/Todo');
      Todo.findByIdAndDelete.mockResolvedValue({ _id: 'test-id' });

      const res = await request(app).delete('/api/todos/test-id');

      expect(res.status).toBe(204);
    });

    it('should return 404 for non-existent todo', async () => {
      // eslint-disable-next-line global-require
      const Todo = require('../models/Todo');
      Todo.findByIdAndDelete.mockResolvedValue(null);

      const res = await request(app).delete('/api/todos/nonexistent-id');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Todo not found');
    });
  });
});
