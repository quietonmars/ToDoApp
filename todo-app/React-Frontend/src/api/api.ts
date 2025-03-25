import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true,  // Disable for now
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add response interceptor to handle CORS
api.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.message === "Network Error") {
    console.error("CORS blocked request. Verify backend settings.");
  }
  return Promise.reject(error);
});

export default api;