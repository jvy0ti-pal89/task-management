'use client';

import React, { useState, useEffect } from 'react';
import { taskService, Task, TaskListResponse } from '@/lib/tasks';
import { useToast } from '@/lib/useToast';
import styles from './TaskManager.module.css';

export const TaskManager: React.FC = () => {
  const { show } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState<string>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    loadTasks();
  }, [page, status, search]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await taskService.list(page, limit, status || undefined, search || undefined);
      setTasks(response.data);
      setTotal(response.total);
    } catch (error) {
      show('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      show('Title is required', 'error');
      return;
    }
    try {
      await taskService.create(newTitle, newDescription);
      show('Task created', 'success');
      setNewTitle('');
      setNewDescription('');
      setPage(1);
      loadTasks();
    } catch (error: any) {
      show(error.response?.data?.error || 'Failed to create task', 'error');
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await taskService.toggle(id);
      show('Task toggled', 'success');
      loadTasks();
    } catch (error) {
      show('Failed to toggle task', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await taskService.delete(id);
      show('Task deleted', 'success');
      loadTasks();
    } catch (error) {
      show('Failed to delete task', 'error');
    }
  };

  const handleEditStart = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const handleEditSave = async (id: number) => {
    if (!editTitle.trim()) {
      show('Title is required', 'error');
      return;
    }
    try {
      await taskService.update(id, editTitle, editDescription);
      show('Task updated', 'success');
      setEditingId(null);
      loadTasks();
    } catch (error: any) {
      show(error.response?.data?.error || 'Failed to update task', 'error');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className={styles.container}>
      <h1>Task Dashboard</h1>

      {/* Create Task Form */}
      <form onSubmit={handleCreateTask} className={styles.createForm}>
        <h3>Create New Task</h3>
        <div className={styles.formRow}>
          <input
            type="text"
            placeholder="Task title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <button type="submit">Create Task</button>
        </div>
      </form>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select value={status} onChange={(e) => {
          setStatus(e.target.value);
          setPage(1);
        }}>
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      {/* Task List */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className={styles.empty}>No tasks found</p>
      ) : (
        <div className={styles.taskList}>
          {tasks.map((task) => (
            <div key={task.id} className={styles.taskCard}>
              {editingId === task.id ? (
                <div className={styles.editForm}>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  <div className={styles.editButtons}>
                    <button onClick={() => handleEditSave(task.id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.taskContent}>
                    <h4>{task.title}</h4>
                    {task.description && <p>{task.description}</p>}
                  </div>
                  <div className={styles.taskMeta}>
                    <span className={`${styles.status} ${styles[task.status.toLowerCase()]}`}>
                      {task.status}
                    </span>
                    <div className={styles.taskActions}>
                      <button
                        className={styles.toggleBtn}
                        onClick={() => handleToggle(task.id)}
                        title={task.status === 'OPEN' ? 'Mark as Done' : 'Mark as Open'}
                      >
                        {task.status === 'OPEN' ? '✓' : '↻'}
                      </button>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEditStart(task)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            ← Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};
