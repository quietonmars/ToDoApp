import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  getTodoLists, 
  createTodoList, 
  updateTodoList, 
  deleteTodoList 
} from '../api/todos';
import { TodoList } from '../types/todo';

type TodoStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

const TodoPage: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [newTodo, setNewTodo] = useState<{
    title: string;
    status: TodoStatus;
    tasks: string;
  }>({
    title: '',
    status: 'TODO',
    tasks: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch todo lists on mount and when authentication changes
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getTodoLists();
        setTodoLists(response.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          // Session expired or not authenticated
          logout();
          navigate('/login');
        } else {
          setError('Failed to load todo lists. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchTodos();
    }
  }, [isAuthenticated, logout, navigate]);

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      const response = await createTodoList(
        newTodo.title, 
        newTodo.status, 
        newTodo.tasks
      );
      setTodoLists([...todoLists, response.data]);
      setNewTodo({ title: '', status: 'TODO', tasks: '' });
    } catch (err: any) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError('Failed to create todo list. Please try again.');
      }
    }
  };

  const handleUpdateTodo = async (id: number, updatedData: Partial<TodoList>) => {
    try {
      setError('');
      const response = await updateTodoList(
        id,
        updatedData.title || '',
        updatedData.status || 'TODO',
        updatedData.tasks || ''
      );
      setTodoLists(todoLists.map(todo => 
        todo.id === id ? response.data : todo
      ));
    } catch (err: any) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError('Failed to update todo list. Please try again.');
      }
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      setError('');
      await deleteTodoList(id);
      setTodoLists(todoLists.filter(todo => todo.id !== id));
    } catch (err: any) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError('Failed to delete todo list. Please try again.');
      }
    }
  };

  if (!isAuthenticated) {
    return null; // Already redirecting in useEffect
  }

  if (loading) {
    return <div className="loading">Loading your todo lists...</div>;
  }

  return (
    <div className="todo-page">
      <header className="todo-header">
        <h1>My Todo Lists</h1>
        <button 
          className="logout-btn"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Logout
        </button>
      </header>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      )}

      <div className="todo-content">
        <div className="create-todo-form">
          <h2>Create New Todo List</h2>
          <form onSubmit={handleCreateTodo}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Enter title"
                value={newTodo.title}
                onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={newTodo.status}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'TODO' || value === 'IN_PROGRESS' || value === 'DONE') {
                    setNewTodo({
                      ...newTodo,
                      status: value as TodoStatus
                    });
                  }
                }}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tasks">Tasks (one per line)</label>
              <textarea
                id="tasks"
                placeholder="Enter tasks, one per line"
                value={newTodo.tasks}
                onChange={(e) => setNewTodo({...newTodo, tasks: e.target.value})}
                rows={4}
              />
            </div>

            <button type="submit" className="submit-btn">
              Create Todo List
            </button>
          </form>
        </div>

        <div className="todo-lists-container">
          <h2>Your Todo Lists</h2>
          {todoLists.length === 0 ? (
            <div className="empty-state">
              <p>No todo lists yet. Create your first one!</p>
            </div>
          ) : (
            <ul className="todo-lists">
              {todoLists.map(todo => (
                <li key={todo.id} className="todo-card">
                  <div className="todo-card-header">
                    <h3>{todo.title}</h3>
                    <span className={`status-badge status-${todo.status.toLowerCase()}`}>
                      {todo.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="todo-card-body">
                    <h4>Tasks:</h4>
                    <div className="tasks-content">
                      {todo.tasks.split('\n').map((task, i) => (
                        task.trim() && <div key={i} className="task-item">{task}</div>
                      ))}
                    </div>
                  </div>

                  <div className="todo-card-actions">
                    <button 
                      className={`status-btn ${todo.status === 'DONE' ? 'undo-btn' : 'complete-btn'}`}
                      onClick={() => handleUpdateTodo(todo.id, { 
                        status: todo.status === 'DONE' ? 'TODO' : 'DONE' 
                      })}
                    >
                      {todo.status === 'DONE' ? 'Mark as Not Done' : 'Mark as Done'}
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this todo list?')) {
                          handleDeleteTodo(todo.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoPage;