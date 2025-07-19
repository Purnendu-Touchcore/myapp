import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoItem from '../components/TodoItem';

describe('TodoItem', () => {
  const mockTodo = {
    _id: '1',
    title: 'Test Todo',
    description: 'Test description',
    status: 'pending',
    createdAt: '2025-01-01T10:00:00.000Z'
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.confirm
    window.confirm = jest.fn();
  });

  afterEach(() => {
    window.confirm.mockRestore();
  });

  test('renders todo item with title and description', () => {
    render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  test('renders pending status correctly', () => {
    render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    expect(screen.getByText('⏳ Pending')).toBeInTheDocument();
  });

  test('renders completed status correctly', () => {
    const completedTodo = { ...mockTodo, status: 'completed' };
    render(<TodoItem todo={completedTodo} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    expect(screen.getByText('✓ Completed')).toBeInTheDocument();
  });

  test('applies line-through style for completed todos', () => {
    const completedTodo = { ...mockTodo, status: 'completed' };
    render(<TodoItem todo={completedTodo} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const title = screen.getByText('Test Todo');
    expect(title).toHaveClass('line-through');
  });

  test('renders creation date', () => {
    render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    expect(screen.getByText(/Created:/)).toBeInTheDocument();
  });

  test('renders edit and delete buttons', () => {
    render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    expect(screen.getByTitle('Edit todo')).toBeInTheDocument();
    expect(screen.getByTitle('Delete todo')).toBeInTheDocument();
  });

  test('calls onEdit when edit button is clicked', () => {
    render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const editButton = screen.getByTitle('Edit todo');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTodo);
  });

  test('calls onDelete when delete button is clicked and confirmed', () => {
    window.confirm.mockReturnValue(true);
    
    render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByTitle('Delete todo');
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this todo?');
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  test('does not call onDelete when delete is cancelled', () => {
    window.confirm.mockReturnValue(false);
    
    render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByTitle('Delete todo');
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  test('does not render description when not provided', () => {
    const todoWithoutDescription = { ...mockTodo, description: '' };
    render(<TodoItem todo={todoWithoutDescription} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
  });
});