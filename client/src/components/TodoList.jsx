import React from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading todos...</p>
        </div>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No todos yet</h3>
          <p className="text-gray-600">Create your first todo to get started!</p>
        </div>
      </div>
    );
  }

  const pendingTodos = todos.filter(todo => todo.status === 'pending');
  const completedTodos = todos.filter(todo => todo.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{todos.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">{pendingTodos.length}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{completedTodos.length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>
      </div>

      {/* Pending Todos */}
      {pendingTodos.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
            Pending Tasks ({pendingTodos.length})
          </h2>
          <div className="space-y-3">
            {pendingTodos.map(todo => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Completed Tasks ({completedTodos.length})
          </h2>
          <div className="space-y-3">
            {completedTodos.map(todo => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoList;