import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, onEdit, onDelete, onToggleStatus }) => {
  if (todos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">No todos yet!</p>
        <p className="text-gray-400 text-sm mt-2">Add your first todo above to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
};

export default TodoList;