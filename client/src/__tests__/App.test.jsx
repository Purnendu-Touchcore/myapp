import React from 'react';
import {
  render, screen, waitFor, fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

const axios = require('axios');

// Mock console.error to avoid noise in tests
// eslint-disable-next-line no-console
const originalError = console.error;
beforeAll(() => {
  // eslint-disable-next-line no-console
  console.error = jest.fn();
});

afterAll(() => {
  // eslint-disable-next-line no-console
  console.error = originalError;
});

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders todo list', async () => {
    // Mock the API response
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<App />);

    // Check if the main heading is rendered
    expect(screen.getByText(/Todo List/i)).toBeInTheDocument();

    // Wait for loading to finish and empty state to show
    await waitFor(() => {
      expect(screen.getByText(/No todos yet!/i)).toBeInTheDocument();
    });

    // Check if the form is also rendered
    expect(screen.getByText(/Add New Todo/i)).toBeInTheDocument();
  });

  test('displays todos when API returns data', async () => {
    const mockTodos = [
      {
        _id: '1',
        title: 'Test Todo 1',
        description: 'Test Description 1',
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      {
        _id: '2',
        title: 'Test Todo 2',
        description: 'Test Description 2',
        status: 'completed',
        createdAt: new Date().toISOString(),
      },
    ];

    axios.get.mockResolvedValueOnce({ data: mockTodos });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    // Check todo count
    expect(screen.getByText('Your Todos (2)')).toBeInTheDocument();
  });

  test('displays error when API call fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch todos/i)).toBeInTheDocument();
    });
  });

  test('can create a new todo', async () => {
    const mockTodos = [];
    const newTodo = {
      _id: '1',
      title: 'New Todo',
      description: 'New Description',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    axios.get.mockResolvedValueOnce({ data: mockTodos });
    axios.post.mockResolvedValueOnce({ data: newTodo });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Add New Todo/i)).toBeInTheDocument();
    });

    // Fill out the form
    const titleInput = screen.getByPlaceholderText(/Enter todo title/i);
    const descriptionInput = screen.getByPlaceholderText(/Enter todo description/i);
    const submitButton = screen.getByText(/Add Todo/i);

    fireEvent.change(titleInput, { target: { value: 'New Todo' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/todos',
        { title: 'New Todo', description: 'New Description' },
      );
    });
  });
});
