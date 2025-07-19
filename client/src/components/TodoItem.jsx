import React from 'react';

function TodoItem({ todo, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEdit = () => {
    onEdit(todo);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      onDelete(todo._id);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
      todo.status === 'completed' 
        ? 'border-green-500 bg-green-50' 
        : 'border-blue-500'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-lg font-semibold ${
          todo.status === 'completed' 
            ? 'text-green-800 line-through' 
            : 'text-gray-800'
        }`}>
          {todo.title}
        </h3>
        
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-800 focus:outline-none"
            title="Edit todo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 focus:outline-none"
            title="Delete todo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {todo.description && (
        <p className={`text-gray-600 mb-2 ${
          todo.status === 'completed' ? 'line-through' : ''
        }`}>
          {todo.description}
        </p>
      )}

      <div className="flex justify-between items-center text-sm">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          todo.status === 'completed'
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {todo.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
        </span>
        
        <span className="text-gray-500">
          Created: {formatDate(todo.createdAt)}
        </span>
      </div>
    </div>
  );
}

export default TodoItem;