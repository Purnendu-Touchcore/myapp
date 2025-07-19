import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);

  // Fetch todos from API
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/todos`);
      setTodos(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos. Please make sure the server is running.');
      console.error('Error fetching todos:', err); // eslint-disable-line no-console
    } finally {
      setLoading(false);
    }
  };

  // Create new todo
  const createTodo = async (todoData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/todos`, todoData);
      setTodos([response.data, ...todos]);
      setError(null);
    } catch (err) {
      setError('Failed to create todo');
      console.error('Error creating todo:', err); // eslint-disable-line no-console
      throw err;
    }
  };

  // Update todo
  const updateTodo = async (id, updateData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/todos/${id}`, updateData);
      const updatedTodos = todos.map((todo) => (
        // eslint-disable-next-line no-underscore-dangle
        todo._id === id ? response.data : todo
      ));
      setTodos(updatedTodos);
      setEditingTodo(null);
      setError(null);
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error updating todo:', err); // eslint-disable-line no-console
      throw err;
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id)); // eslint-disable-line no-underscore-dangle
      setError(null);
    } catch (err) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', err); // eslint-disable-line no-console
    }
  };

  // Toggle todo status
  const toggleTodoStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    await updateTodo(id, { status: newStatus });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Todo List
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {editingTodo ? 'Edit Todo' : 'Add New Todo'}
            </h2>
            <TodoForm
              todo={editingTodo}
              onSubmit={editingTodo
                // eslint-disable-next-line no-underscore-dangle
                ? (data) => updateTodo(editingTodo._id, data)
                : createTodo}
              onCancel={() => setEditingTodo(null)}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Your Todos (
              {todos.length}
              )
            </h2>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : (
              <TodoList
                todos={todos}
                onEdit={setEditingTodo}
                onDelete={deleteTodo}
                onToggleStatus={toggleTodoStatus}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
