import React, { useState, useEffect } from 'react';

function TodoForm({ onSubmit, editingTodo, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending'
  });

  // Update form when editing todo changes
  useEffect(() => {
    if (editingTodo) {
      setFormData({
        title: editingTodo.title,
        description: editingTodo.description || '',
        status: editingTodo.status
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'pending'
      });
    }
  }, [editingTodo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      return;
    }

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status
    });

    // Reset form if not editing
    if (!editingTodo) {
      setFormData({
        title: '',
        description: '',
        status: 'pending'
      });
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {editingTodo ? 'Edit Todo' : 'Add New Todo'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter todo title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter todo description (optional)"
          />
        </div>

        {editingTodo && (
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={!formData.title.trim()}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {editingTodo ? 'Update Todo' : 'Add Todo'}
          </button>
          
          {editingTodo && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TodoForm;