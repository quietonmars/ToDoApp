import React, { useState } from 'react';
import { TodoList } from '../types/todo';
import { updateTodoList, deleteTodoList } from '../api/todos';

interface TodoListCardProps {
  todo: TodoList;
  onUpdate: () => void;
}

const TodoListCard: React.FC<TodoListCardProps> = ({ todo, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: todo.title,
    status: todo.status,
    tasks: todo.tasks,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTodoList(todo.id, formData.title, formData.status, formData.tasks);
      onUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodoList(todo.id);
      onUpdate();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div className="todo-card">
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          <textarea
            name="tasks"
            value={formData.tasks}
            onChange={handleChange}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <h3>{todo.title}</h3>
          <p>Status: {todo.status}</p>
          <pre>{todo.tasks}</pre>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </div>
  );
};

export default TodoListCard;