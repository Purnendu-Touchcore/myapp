import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoItem from '../components/TodoItem';

const mockTodo = {
  _id: '1',
  title: 'Test Todo',
  description: 'Test Description',
  status: 'pending',
  createdAt: new Date().toISOString()
};

const mockProps = {
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onToggleStatus: jest.fn()
};

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: jest.fn(() => true)
});

describe('TodoItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders todo information', () => {
    render(<TodoItem todo={mockTodo} {...mockProps} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText(/created:/i)).toBeInTheDocument();
  });

  test('calls onEdit when edit button is clicked', async () => {
    render(<TodoItem todo={mockTodo} {...mockProps} />);
    
    await userEvent.click(screen.getByLabelText(/edit todo/i));
    
    expect(mockProps.onEdit).toHaveBeenCalledWith(mockTodo);
  });

  test('calls onDelete when delete button is clicked and confirmed', async () => {
    render(<TodoItem todo={mockTodo} {...mockProps} />);
    
    await userEvent.click(screen.getByLabelText(/delete todo/i));
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockProps.onDelete).toHaveBeenCalledWith(mockTodo._id);
  });

  test('does not call onDelete when delete is not confirmed', async () => {
    window.confirm.mockReturnValue(false);
    render(<TodoItem todo={mockTodo} {...mockProps} />);
    
    await userEvent.click(screen.getByLabelText(/delete todo/i));
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockProps.onDelete).not.toHaveBeenCalled();
  });

  test('calls onToggleStatus when status button is clicked', async () => {
    render(<TodoItem todo={mockTodo} {...mockProps} />);
    
    await userEvent.click(screen.getByLabelText(/mark as completed/i));
    
    expect(mockProps.onToggleStatus).toHaveBeenCalledWith(mockTodo._id, mockTodo.status);
  });

  test('renders completed todo differently', () => {
    const completedTodo = { ...mockTodo, status: 'completed' };
    render(<TodoItem todo={completedTodo} {...mockProps} />);
    
    expect(screen.getByText('completed')).toBeInTheDocument();
    expect(screen.getByLabelText(/mark as pending/i)).toBeInTheDocument();
  });
});