import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/tasks/",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

/**
 * Fetch all tasks.
 * GET /tasks/
 */
export const fetchTasks = () => api.get("");

/**
 * Create a new task.
 * POST /tasks/
 * @param {{ title: string, description?: string }} data
 */
export const createTask = (data) => api.post("", data);

/**
 * Retrieve a single task.
 * GET /tasks/{id}/
 * @param {number} id
 */
export const getTask = (id) => api.get(`${id}/`);

/**
 * Full update — title & description only.
 * PUT /tasks/{id}/
 * @param {number} id
 * @param {{ title: string, description?: string }} data
 */
export const updateTask = (id, data) => api.put(`${id}/`, data);

/**
 * Toggle completed status.
 * PATCH /tasks/{id}/
 * @param {number} id
 * @param {{ completed: boolean }} data
 */
export const toggleTask = (id, data) => api.patch(`${id}/`, data);

/**
 * Delete a task.
 * DELETE /tasks/{id}/
 * @param {number} id
 */
export const deleteTask = (id) => api.delete(`${id}/`);
