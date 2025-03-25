import React, { useState, useEffect } from 'react';
import { getTodoLists, createTodoList } from '../api/todos';
import { TodoList } from '../types/todo';
import TodoListCard from '../components/TodoListCard';

interface NewTodo {
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  tasks: string;
}

const TodoPage: React.FC = () => {
  const [todos, setTodos] = useState<TodoList[]>([]);
  const [newTodo, setNewTodo] = useState<NewTodo>({
    title: '',
    status: 'TODO',
    tasks: '',
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await getTodoLists();
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTodoList(newTodo.title, newTodo.status, newTodo.tasks);
      setNewTodo({ title: '', status: 'TODO', tasks: '' });
      fetchTodos();
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  return (
    <div>
      <h2>My Todo Lists</h2>
      
      <form onSubmit={handleCreateTodo}>
        <input
          type="text"
          placeholder="Title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          required
        />
        <select
          value={newTodo.status}
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'TODO' || value === 'IN_PROGRESS' || value === 'DONE') {
              setNewTodo({ 
                ...newTodo, 
                status: value 
              });
            }
          }}
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        <textarea
          placeholder="Tasks (one per line)"
          value={newTodo.tasks}
          onChange={(e) => setNewTodo({ ...newTodo, tasks: e.target.value })}
        />
        <button type="submit">Create Todo List</button>
      </form>

      <div className="todo-list">
        {todos.map(todo => (
          <TodoListCard key={todo.id} todo={todo} onUpdate={fetchTodos} />
        ))}
      </div>
    </div>
  );
};

export default TodoPage;