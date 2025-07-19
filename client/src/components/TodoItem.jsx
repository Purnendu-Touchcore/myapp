import React, { useState } from 'react';

const TodoItem = ({ todo, onEdit, onDelete, onToggleStatus }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      setIsDeleting(true);
      await onDelete(todo._id);
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async () => {
    setIsToggling(true);
    await onToggleStatus(todo._id, todo.status);
    setIsToggling(false);
  };

  const handleEdit = () => {
    onEdit(todo);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`border rounded-lg p-4 transition-all duration-200 ${
      todo.status === 'completed' 
        ? 'bg-green-50 border-green-200' 
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={handleToggleStatus}
              disabled={isToggling}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                todo.status === 'completed'
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-green-400'
              } ${isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              aria-label={todo.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
            >
              {todo.status === 'completed' && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            <h3 className={`text-lg font-medium truncate ${
              todo.status === 'completed' 
                ? 'text-green-700 line-through' 
                : 'text-gray-900'
            }`}>
              {todo.title}
            </h3>
            
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              todo.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {todo.status}
            </span>
          </div>
          
          {todo.description && (
            <p className={`text-sm mb-2 ${
              todo.status === 'completed' 
                ? 'text-green-600 line-through' 
                : 'text-gray-600'
            }`}>
              {todo.description}
            </p>
          )}
          
          <p className="text-xs text-gray-400">
            Created: {formatDate(todo.createdAt)}
          </p>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={handleEdit}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-200"
            aria-label="Edit todo"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Delete todo"
            title="Delete"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;