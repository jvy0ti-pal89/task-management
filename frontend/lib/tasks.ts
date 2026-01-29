import api from './api';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'OPEN' | 'DONE';
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskListResponse {
  data: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const taskService = {
  list: async (page = 1, limit = 10, status?: string, search?: string): Promise<TaskListResponse> => {
    const params: any = { page, limit };
    if (status) params.status = status;
    if (search) params.search = search;
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  create: async (title: string, description?: string): Promise<Task> => {
    const response = await api.post('/tasks', { title, description });
    return response.data;
  },

  update: async (id: number, title?: string, description?: string, status?: string): Promise<Task> => {
    const data: any = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (status !== undefined) data.status = status;
    const response = await api.patch(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  toggle: async (id: number): Promise<Task> => {
    const response = await api.post(`/tasks/${id}/toggle`);
    return response.data;
  },
};
