import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoList from '../components/TodoList';

describe('TodoList', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const mockTodos = [
    {
      _id: '1',
      title: 'Pending Todo',
      description: 'Pending description',
      status: 'pending',
      createdAt: '2025-01-01T10:00:00.000Z'
    },
    {
      _id: '2',
      title: 'Completed Todo',
      description: 'Completed description',
      status: 'completed',
      createdAt: '2025-01-01T11:00:00.000Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading state when loading is true', () => {
    render(
      <TodoList 
        todos={[]} 
        loading={true} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByText('Loading todos...')).toBeInTheDocument();
  });

  test('shows empty state when no todos exist', () => {
    render(
      <TodoList 
        todos={[]} 
        loading={false} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByText('No todos yet')).toBeInTheDocument();
    expect(screen.getByText('Create your first todo to get started!')).toBeInTheDocument();
  });

  test('renders todo statistics', () => {
    render(
      <TodoList 
        todos={mockTodos} 
        loading={false} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByText('2')).toBeInTheDocument(); // Total
    expect(screen.getByText('1')).toBeInTheDocument(); // Pending (appears twice for pending and completed)
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  test('separates pending and completed todos', () => {
    render(
      <TodoList 
        todos={mockTodos} 
        loading={false} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByText('Pending Tasks (1)')).toBeInTheDocument();
    expect(screen.getByText('Completed Tasks (1)')).toBeInTheDocument();
  });

  test('renders all todos', () => {
    render(
      <TodoList 
        todos={mockTodos} 
        loading={false} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByText('Pending Todo')).toBeInTheDocument();
    expect(screen.getByText('Completed Todo')).toBeInTheDocument();
  });

  test('only shows pending section when there are pending todos', () => {
    const completedTodos = [mockTodos[1]]; // only completed todo
    
    render(
      <TodoList 
        todos={completedTodos} 
        loading={false} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.queryByText('Pending Tasks')).not.toBeInTheDocument();
    expect(screen.getByText('Completed Tasks (1)')).toBeInTheDocument();
  });

  test('only shows completed section when there are completed todos', () => {
    const pendingTodos = [mockTodos[0]]; // only pending todo
    
    render(
      <TodoList 
        todos={pendingTodos} 
        loading={false} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByText('Pending Tasks (1)')).toBeInTheDocument();
    expect(screen.queryByText('Completed Tasks')).not.toBeInTheDocument();
  });

  test('shows correct statistics for different todo counts', () => {
    const manyTodos = [
      ...mockTodos,
      {
        _id: '3',
        title: 'Another Pending',
        description: '',
        status: 'pending',
        createdAt: '2025-01-01T12:00:00.000Z'
      }
    ];

    render(
      <TodoList 
        todos={manyTodos} 
        loading={false} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByText('3')).toBeInTheDocument(); // Total
    expect(screen.getByText('Pending Tasks (2)')).toBeInTheDocument();
    expect(screen.getByText('Completed Tasks (1)')).toBeInTheDocument();
  });
});