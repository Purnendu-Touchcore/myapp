import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
}));

test('renders todo list heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /todo list/i });
  expect(heading).toBeInTheDocument();
});

test('renders todo form', () => {
  render(<App />);
  const titleInput = screen.getByLabelText(/title/i);
  expect(titleInput).toBeInTheDocument();
});

test('renders add todo button', () => {
  render(<App />);
  const addButton = screen.getByRole('button', { name: /add todo/i });
  expect(addButton).toBeInTheDocument();
});
