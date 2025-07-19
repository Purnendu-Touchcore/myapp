import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoItem from '../components/TodoItem';

const mockTodo = {
  _id: '1',
  title: 'Test Todo',
  description: 'Test Description',
  status: 'pending',
  createdAt: new Date().toISOString(),
};

const mockCompletedTodo = {
  ...mockTodo,
  _id: '2',
  status: 'completed',
  title: 'Completed Todo',
};

const mockProps = {
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onToggleStatus: jest.fn(),
};

describe('TodoItem Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders todo item correctly', () => {
    render(<TodoItem todo={mockTodo} {...mockProps} />);

    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('○ Pending')).toBeInTheDocument();
  });

  test('renders completed todo with strikethrough', () => {
    render(<TodoItem todo={mockCompletedTodo} {...mockProps} />);

    const title = screen.getByText('Completed Todo');
    expect(title).toHaveClass('line-through');
    expect(screen.getByText('✓ Completed')).toBeInTheDocument();
  });

  test('calls onEdit when edit button is clicked', () => {
    render(<TodoItem todo={mockTodo} {...mockProps} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(mockProps.onEdit).toHaveBeenCalledWith(mockTodo);
  });

  test('calls onDelete when delete button is clicked and confirmed', () => {
    // Mock window.confirm
    window.confirm = jest.fn(() => true);

    render(<TodoItem todo={mockTodo} {...mockProps} />);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this todo?');
    expect(mockProps.onDelete).toHaveBeenCalledWith('1');
  });

  test('does not call onDelete when delete is cancelled', () => {
    // Mock window.confirm
    window.confirm = jest.fn(() => false);

    render(<TodoItem todo={mockTodo} {...mockProps} />);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockProps.onDelete).not.toHaveBeenCalled();
  });

  test('calls onToggleStatus when complete button is clicked', () => {
    render(<TodoItem todo={mockTodo} {...mockProps} />);

    const completeButton = screen.getByText('Complete');
    fireEvent.click(completeButton);

    expect(mockProps.onToggleStatus).toHaveBeenCalledWith('1', 'pending');
  });

  test('shows "Mark Pending" button for completed todos', () => {
    render(<TodoItem todo={mockCompletedTodo} {...mockProps} />);

    expect(screen.getByText('Mark Pending')).toBeInTheDocument();
  });
});
