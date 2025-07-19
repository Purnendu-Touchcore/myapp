import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoForm from '../components/TodoForm';

describe('TodoForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form with title and description inputs', () => {
    render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument();
  });

  test('displays "Add New Todo" heading when not editing', () => {
    render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByText('Add New Todo')).toBeInTheDocument();
  });

  test('displays "Edit Todo" heading when editing', () => {
    const editingTodo = {
      _id: '1',
      title: 'Test Todo',
      description: 'Test description',
      status: 'pending'
    };

    render(
      <TodoForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
        editingTodo={editingTodo} 
      />
    );
    
    expect(screen.getByText('Edit Todo')).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
  });

  test('populates form when editing todo', () => {
    const editingTodo = {
      _id: '1',
      title: 'Test Todo',
      description: 'Test description',
      status: 'completed'
    };

    render(
      <TodoForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
        editingTodo={editingTodo} 
      />
    );
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('completed')).toBeInTheDocument();
  });

  test('calls onSubmit with form data when form is submitted', async () => {
    render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /add todo/i });

    fireEvent.change(titleInput, { target: { value: 'New Todo' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Todo',
        description: 'New Description',
        status: 'pending'
      });
    });
  });

  test('does not submit when title is empty', () => {
    render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const submitButton = screen.getByRole('button', { name: /add todo/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('disables submit button when title is empty', () => {
    render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const submitButton = screen.getByRole('button', { name: /add todo/i });
    expect(submitButton).toBeDisabled();
  });

  test('shows cancel button when editing', () => {
    const editingTodo = {
      _id: '1',
      title: 'Test Todo',
      description: 'Test description',
      status: 'pending'
    };

    render(
      <TodoForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
        editingTodo={editingTodo} 
      />
    );
    
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  test('calls onCancel when cancel button is clicked', () => {
    const editingTodo = {
      _id: '1',
      title: 'Test Todo',
      description: 'Test description',
      status: 'pending'
    };

    render(
      <TodoForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
        editingTodo={editingTodo} 
      />
    );
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });
});