import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);

  // Fetch todos from API
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_BASE_URL}/todos`);
      setTodos(response.data);
    } catch (err) {
      setError('Failed to fetch todos. Please check if the server is running.');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new todo
  const createTodo = async (todoData) => {
    try {
      setError('');
      const response = await axios.post(`${API_BASE_URL}/todos`, todoData);
      setTodos([response.data, ...todos]);
      return true;
    } catch (err) {
      setError('Failed to create todo.');
      console.error('Error creating todo:', err);
      return false;
    }
  };

  // Update existing todo
  const updateTodo = async (id, todoData) => {
    try {
      setError('');
      const response = await axios.put(`${API_BASE_URL}/todos/${id}`, todoData);
      setTodos(todos.map(todo => todo._id === id ? response.data : todo));
      setEditingTodo(null);
      return true;
    } catch (err) {
      setError('Failed to update todo.');
      console.error('Error updating todo:', err);
      return false;
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      setError('');
      await axios.delete(`${API_BASE_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete todo.');
      console.error('Error deleting todo:', err);
      return false;
    }
  };

  // Toggle todo status
  const toggleTodoStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await updateTodo(id, { status: newStatus });
  };

  // Handle edit
  const handleEdit = (todo) => {
    setEditingTodo(todo);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  // Handle form submit
  const handleFormSubmit = async (todoData) => {
    if (editingTodo) {
      const success = await updateTodo(editingTodo._id, todoData);
      return success;
    } else {
      const success = await createTodo(todoData);
      return success;
    }
  };

  // Load todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Todo List
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button 
              onClick={fetchTodos} 
              className="ml-2 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingTodo ? 'Edit Todo' : 'Add New Todo'}
          </h2>
          <TodoForm 
            onSubmit={handleFormSubmit}
            onCancel={editingTodo ? handleCancelEdit : null}
            initialValues={editingTodo}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Todos</h2>
          {loading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">Loading todos...</p>
            </div>
          ) : (
            <TodoList 
              todos={todos}
              onEdit={handleEdit}
              onDelete={deleteTodo}
              onToggleStatus={toggleTodoStatus}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;