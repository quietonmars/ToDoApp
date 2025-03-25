export interface TodoList {
    id: number;
    title: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    tasks: string;
    created_at: string;
    updated_at: string;
    user: number;
  }