import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/todos`);
      setTodos(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch todos');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Create new todo
  const createTodo = async (todoData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/todos`, todoData);
      setTodos([response.data, ...todos]);
      setError('');
    } catch (err) {
      setError('Failed to create todo');
      console.error('Error creating todo:', err);
    }
  };

  // Update existing todo
  const updateTodo = async (id, todoData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/todos/${id}`, todoData);
      setTodos(todos.map(todo => 
        todo._id === id ? response.data : todo
      ));
      setEditingTodo(null);
      setError('');
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error updating todo:', err);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', err);
    }
  };

  // Handle form submission
  const handleFormSubmit = (todoData) => {
    if (editingTodo) {
      updateTodo(editingTodo._id, todoData);
    } else {
      createTodo(todoData);
    }
  };

  // Handle edit button click
  const handleEdit = (todo) => {
    setEditingTodo(todo);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Todo List
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Todo Form */}
          <div className="lg:col-span-1">
            <TodoForm
              onSubmit={handleFormSubmit}
              editingTodo={editingTodo}
              onCancel={handleCancelEdit}
            />
          </div>

          {/* Todo List */}
          <div className="lg:col-span-2">
            <TodoList
              todos={todos}
              loading={loading}
              onEdit={handleEdit}
              onDelete={deleteTodo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;