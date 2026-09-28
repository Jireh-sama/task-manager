import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  fetchTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  toggleTask as apiToggleTask,
  deleteTask as apiDeleteTask,
} from "@/api";

const getErrorMessage = (err, fallback = "Something went wrong.") =>
  err?.response?.data?.detail ||
  err?.response?.data?.title?.[0] ||
  err?.message ||
  fallback;

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTasks();
      setTasks(res.data);
    } catch (err) {
      const msg = getErrorMessage(err, "Failed to load tasks.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const createTask = useCallback(async ({ title, description }) => {
    setActionLoading("create");
    try {
      const res = await apiCreateTask({ title, description });
      setTasks((prev) => [res.data, ...prev]);
      toast.success("Task created");
      return res.data;
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create task."));
      throw err;
    } finally {
      setActionLoading(null);
    }
  }, []);

  const updateTask = useCallback(async (id, { title, description }) => {
    setActionLoading(id);
    try {
      const res = await apiUpdateTask(id, { title, description });
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
      toast.success("Task updated");
      return res.data;
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update task."));
      throw err;
    } finally {
      setActionLoading(null);
    }
  }, []);

  const toggleTask = useCallback(async (task) => {
    setActionLoading(task.id);
    try {
      const res = await apiToggleTask(task.id, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? res.data : t)));
      toast.success(res.data.completed ? "Task completed" : "Task reopened");
      return res.data;
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to toggle task."));
      throw err;
    } finally {
      setActionLoading(null);
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    setActionLoading(id);
    try {
      await apiDeleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Task deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete task."));
      throw err;
    } finally {
      setActionLoading(null);
    }
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const completionPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, completionPercent };
  }, [tasks]);

  return {
    tasks,
    loading,
    actionLoading,
    error,
    stats,
    loadTasks,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
  };
}
