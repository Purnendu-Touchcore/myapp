import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoForm from '../components/TodoForm';

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

describe('TodoForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form for creating new todo', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Title *')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Add Todo')).toBeInTheDocument();
    expect(screen.queryByText('Status')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  test('renders form for editing existing todo', () => {
    const todo = {
      _id: '1',
      title: 'Test Todo',
      description: 'Test Description',
      status: 'pending',
    };

    render(<TodoForm todo={todo} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Update Todo')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('submits form with correct data', async () => {
    mockOnSubmit.mockResolvedValueOnce();

    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText('Title *');
    const descriptionInput = screen.getByLabelText('Description');
    const submitButton = screen.getByText('Add Todo');

    fireEvent.change(titleInput, { target: { value: 'New Todo' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Todo',
        description: 'New Description',
      });
    });
  });

  test('shows error when title is empty', async () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByText('Add Todo');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('trims whitespace from inputs', async () => {
    mockOnSubmit.mockResolvedValueOnce();

    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText('Title *');
    const descriptionInput = screen.getByLabelText('Description');
    const submitButton = screen.getByText('Add Todo');

    fireEvent.change(titleInput, { target: { value: '  Todo with spaces  ' } });
    fireEvent.change(descriptionInput, { target: { value: '  Description with spaces  ' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Todo with spaces',
        description: 'Description with spaces',
      });
    });
  });

  test('calls onCancel when cancel button is clicked', () => {
    const todo = {
      _id: '1', title: 'Test', description: '', status: 'pending',
    };

    render(<TodoForm todo={todo} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('includes status when editing todo', async () => {
    const todo = {
      _id: '1',
      title: 'Test Todo',
      description: 'Test Description',
      status: 'pending',
    };

    mockOnSubmit.mockResolvedValueOnce();

    render(<TodoForm todo={todo} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const statusSelect = screen.getByLabelText('Status');
    const submitButton = screen.getByText('Update Todo');

    fireEvent.change(statusSelect, { target: { value: 'completed' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: 'Test Description',
        status: 'completed',
      });
    });
  });

  test('shows error when onSubmit fails', async () => {
    mockOnSubmit.mockRejectedValueOnce(new Error('Failed'));

    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText('Title *');
    const submitButton = screen.getByText('Add Todo');

    fireEvent.change(titleInput, { target: { value: 'Test Todo' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to save todo. Please try again.')).toBeInTheDocument();
    });
  });
});
