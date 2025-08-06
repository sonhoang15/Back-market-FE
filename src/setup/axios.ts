import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { toast } from 'react-toastify';

// Không cần dotenv trong React frontend
// Dùng biến môi trường từ process.env là được
const instance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BACKEND_URL, // Với Vite
  // baseURL: process.env.REACT_APP_BACKEND_URL,       // Với Create React App
});

console.log("✅ Axios baseURL:", import.meta.env.VITE_REACT_APP_BACKEND_URL);

instance.defaults.withCredentials = true;

// Request Interceptor
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem("jwt");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    const status = error.response?.status || 500;

    switch (status) {
      case 401: {
        toast.error("401 Unauthorized, please login.");
        return error.response?.data;
      }
      case 403:
      case 400:
      case 404:
      case 409:
      case 422: {
        return Promise.reject(error);
      }
      default: {
        return Promise.reject(error);
      }
    }
  }
);

export default instance;
