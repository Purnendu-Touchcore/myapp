import React from 'react';
import TodoItem from './TodoItem';

function TodoList({
  todos, onEdit, onDelete, onToggleStatus,
}) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-lg">No todos yet!</p>
        <p className="text-sm">Create your first todo to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id} // eslint-disable-line no-underscore-dangle
          todo={todo}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
}

export default TodoList;
