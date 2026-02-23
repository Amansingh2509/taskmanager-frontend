import axios from "axios";

// Get the base API URL (without /api/auth or /api/tasks suffix)
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl)
    return envUrl
      .replace("/api/auth", "")
      .replace("/api/tasks", "")
      .replace(/\/$/, "");

  // Fallback for local development only
  if (import.meta.env.DEV) {
    return "http://localhost:5001";
  }

  return "";
};

const BASE_URL = getBaseUrl();

// Create axios instance for auth (uses /api/auth)
const authApi = axios.create({
  baseURL: `${BASE_URL}/api/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create axios instance for tasks (uses /api/tasks)
const taskApi = axios.create({
  baseURL: `${BASE_URL}/api/tasks`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests for both instances
const addToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

authApi.interceptors.request.use(addToken);
taskApi.interceptors.request.use(addToken);

// Debug logging
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Auth API Error:", error.message);
    return Promise.reject(error);
  },
);

taskApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Task API Error:", error.message);
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await authApi.post("/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await authApi.post("/login", credentials);
    return response.data;
  },

  getUser: async () => {
    const response = await authApi.get("/getuser");
    return response.data;
  },
};

// Task API
export const taskAPI = {
  getTasks: async () => {
    const response = await taskApi.get("/");
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await taskApi.post("/", taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await taskApi.put(`/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await taskApi.delete(`/${id}`);
    return response.data;
  },
};
