import { render, screen } from '@testing-library/react';
import TodoList from '../components/TodoList';

const mockTodos = [
  {
    _id: '1',
    title: 'Test Todo 1',
    description: 'Description 1',
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Test Todo 2',
    description: 'Description 2',
    status: 'completed',
    createdAt: new Date().toISOString()
  }
];

const mockProps = {
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onToggleStatus: jest.fn()
};

describe('TodoList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders empty state when no todos', () => {
    render(<TodoList todos={[]} {...mockProps} />);
    
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
    expect(screen.getByText(/add your first todo/i)).toBeInTheDocument();
  });

  test('renders todo items when todos exist', () => {
    render(<TodoList todos={mockTodos} {...mockProps} />);
    
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  test('displays correct status for todos', () => {
    render(<TodoList todos={mockTodos} {...mockProps} />);
    
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('completed')).toBeInTheDocument();
  });
});