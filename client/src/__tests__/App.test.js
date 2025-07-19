import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock axios directly
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

import axios from 'axios';
const mockedAxios = axios;

// Mock console.error to avoid error logs in tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('App', () => {
  test('renders todo list', async () => {
    // Mock API response
    mockedAxios.get.mockResolvedValue({
      data: []
    });

    render(<App />);
    
    // Check if the main heading is rendered
    expect(screen.getByText(/Todo List/i)).toBeInTheDocument();
    
    // Check if form elements are present
    expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument();
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
    });
  });

  test('displays error when API fails', async () => {
    // Mock API error
    mockedAxios.get.mockRejectedValue(new Error('API Error'));

    render(<App />);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch todos/i)).toBeInTheDocument();
    });
    
    // Check retry button is present
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  test('can add a new todo', async () => {
    const mockTodo = {
      _id: '1',
      title: 'Test Todo',
      description: 'Test Description',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Mock initial empty response
    mockedAxios.get.mockResolvedValue({ data: [] });
    // Mock successful create
    mockedAxios.post.mockResolvedValue({ data: mockTodo });

    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
    });

    // Fill form
    await userEvent.type(screen.getByRole('textbox', { name: /title/i }), 'Test Todo');
    await userEvent.type(screen.getByRole('textbox', { name: /description/i }), 'Test Description');
    
    // Submit form
    await userEvent.click(screen.getByRole('button', { name: /add todo/i }));

    // Check if axios.post was called
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/todos',
        {
          title: 'Test Todo',
          description: 'Test Description',
          status: 'pending'
        }
      );
    });
  });
});
