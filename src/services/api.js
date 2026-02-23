import axios from "axios";

const API_URL = "http://localhost:5001/api/auth";

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

// Task API
export const taskAPI = {
  getTasks: async () => {
    const response = await api.get("http://localhost:5001/api/tasks");
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post(
      "http://localhost:5001/api/tasks",
      taskData,
    );
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(
      `http://localhost:5001/api/tasks/${id}`,
      taskData,
    );
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`http://localhost:5001/api/tasks/${id}`);
    return response.data;
  },
};

export default api;
