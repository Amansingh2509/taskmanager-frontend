import axios from "axios";

// Use environment-based URL for production vs development
// IMPORTANT: Set VITE_API_URL in Vercel to: https://taskmanager-backend-indol.vercel.app
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;

  // Fallback for local development only
  if (import.meta.env.DEV) {
    return "http://localhost:5001/api/auth";
  }

  // Production fallback - but this MUST be overridden in Vercel!
  return "/api/auth";
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Debug logging in development
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.message);
    console.error("API URL:", API_URL);
    return Promise.reject(error);
  },
);

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
