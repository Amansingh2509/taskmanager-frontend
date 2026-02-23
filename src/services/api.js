import axios from "axios";

// Use environment-based URL for production vs development
const API_URL = import.meta.env.VITE_API_URL || "/api/auth";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post("/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/login", credentials);
    return response.data;
  },

  getUser: async () => {
    const response = await api.get("/getuser");
    return response.data;
  },
};

// Task API - use relative paths
export const taskAPI = {
  getTasks: async () => {
    const response = await api.get("/tasks");
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post("/tasks", taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default api;
