// src/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // örn: http://localhost:5000 (local) / https://shareyourself.onrender.com (prod)
  withCredentials: true, // cookie için şart
});

export default api;
