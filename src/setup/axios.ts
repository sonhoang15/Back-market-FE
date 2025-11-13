import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { toast } from "react-toastify";



const instance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BACKEND_URL,
  withCredentials: true,
});


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
      case 403: {
        toast.error("403 Forbidden - Không đủ quyền.");
        return Promise.reject(error.response?.data);
      }
      case 404: {
        toast.error("404 Not Found - Không tìm thấy API.");
        return Promise.reject(error.response?.data);
      }
      case 400:
      case 409:
      case 422: {
        return Promise.reject(error.response?.data);
      }
      default: {
        toast.error("Something went wrong!");
        return Promise.reject(error.response?.data || error);
      }
    }
  }
);

export default instance;
