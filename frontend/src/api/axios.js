import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const loginUser = (credentials) => api.post("/auth/login", credentials);
export const registerUser = (userData) => api.post("/auth/register", userData);

// Contacts API
export const getContacts = () => api.get("/contacts");
export const createContact = (contact) => api.post("/contacts", contact);
export const deleteContact = (id) => api.delete(`/contacts/${id}`);
export const getAuthUser = () => api.get("/auth/me");

export default api;
