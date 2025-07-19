import React from 'react';

function TodoItem({
  todo, onEdit, onDelete, onToggleStatus,
}) {
  const handleDelete = () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this todo?')) {
      onDelete(todo._id); // eslint-disable-line no-underscore-dangle
    }
  };

  const handleToggleStatus = () => {
    onToggleStatus(todo._id, todo.status); // eslint-disable-line no-underscore-dangle
  };

  const isCompleted = todo.status === 'completed';

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
      isCompleted ? 'border-green-500 bg-green-50' : 'border-blue-500'
    }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${
            isCompleted ? 'line-through text-gray-500' : 'text-gray-800'
          }`}
          >
            {todo.title}
          </h3>
          {todo.description && (
            <p className={`text-sm mt-1 ${
              isCompleted ? 'text-gray-400' : 'text-gray-600'
            }`}
            >
              {todo.description}
            </p>
          )}
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isCompleted
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
            >
              {isCompleted ? '✓ Completed' : '○ Pending'}
            </span>
            <span className="ml-2">
              {new Date(todo.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 ml-4">
          <button
            type="button"
            onClick={handleToggleStatus}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              isCompleted
                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isCompleted ? 'Mark Pending' : 'Complete'}
          </button>
          <button
            type="button"
            onClick={() => onEdit(todo)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoItem;
