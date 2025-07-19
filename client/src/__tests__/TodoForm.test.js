import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoForm from '../components/TodoForm';

const mockProps = {
  onSubmit: jest.fn(),
  onCancel: null,
  initialValues: null
};

describe('TodoForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProps.onSubmit.mockResolvedValue(true);
  });

  test('renders form elements', () => {
    render(<TodoForm {...mockProps} />);
    
    expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument();
  });

  test('calls onSubmit with form data', async () => {
    render(<TodoForm {...mockProps} />);
    
    await userEvent.type(screen.getByRole('textbox', { name: /title/i }), 'Test Title');
    await userEvent.type(screen.getByRole('textbox', { name: /description/i }), 'Test Description');
    await userEvent.click(screen.getByRole('button', { name: /add todo/i }));
    
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        title: 'Test Title',
        description: 'Test Description',
        status: 'pending'
      });
    });
  });

  test('does not submit when title is empty', async () => {
    render(<TodoForm {...mockProps} />);
    
    await userEvent.click(screen.getByRole('button', { name: /add todo/i }));
    
    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  test('renders cancel button when onCancel is provided', () => {
    render(<TodoForm {...mockProps} onCancel={jest.fn()} />);
    
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  test('renders with initial values when editing', () => {
    const initialValues = {
      title: 'Edit Title',
      description: 'Edit Description',
      status: 'completed'
    };
    
    render(<TodoForm {...mockProps} initialValues={initialValues} />);
    
    expect(screen.getByRole('textbox', { name: /title/i })).toHaveValue('Edit Title');
    expect(screen.getByRole('textbox', { name: /description/i })).toHaveValue('Edit Description');
    expect(screen.getByRole('button', { name: /update todo/i })).toBeInTheDocument();
  });
});