import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoList from '../components/TodoList';

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

const mockProps = {
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onToggleStatus: jest.fn(),
};

describe('TodoList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders empty state when no todos', () => {
    render(<TodoList todos={[]} {...mockProps} />);

    expect(screen.getByText('No todos yet!')).toBeInTheDocument();
    expect(screen.getByText('Create your first todo to get started.')).toBeInTheDocument();
  });

  test('renders list of todos', () => {
    render(<TodoList todos={mockTodos} {...mockProps} />);

    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    expect(screen.getByText('Test Description 1')).toBeInTheDocument();
    expect(screen.getByText('Test Description 2')).toBeInTheDocument();
  });

  test('passes props to TodoItem components', () => {
    render(<TodoList todos={mockTodos} {...mockProps} />);

    // Check that edit buttons are present (indicating props were passed)
    const editButtons = screen.getAllByText('Edit');
    expect(editButtons).toHaveLength(2);

    // Check that delete buttons are present
    const deleteButtons = screen.getAllByText('Delete');
    expect(deleteButtons).toHaveLength(2);
  });
});
