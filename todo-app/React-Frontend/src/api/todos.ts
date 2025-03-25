import api from './api';

export const getTodoLists = () => {
  return api.get('lists/');
};

export const createTodoList = (title: string, status: string, tasks: string) => {
  return api.post('lists/', { title, status, tasks });
};

export const updateTodoList = (id: number, title: string, status: string, tasks: string) => {
  return api.put(`lists/${id}/`, { title, status, tasks });
};

export const deleteTodoList = (id: number) => {
  return api.delete(`lists/${id}/`);
};