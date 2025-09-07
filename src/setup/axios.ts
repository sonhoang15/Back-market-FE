import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { toast } from "react-toastify";

// Tạo 1 instance của axios để cấu hình mặc định
const instance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BACKEND_URL, // Đọc biến môi trường từ Vite
  // baseURL: process.env.REACT_APP_BACKEND_URL,       // Nếu bạn dùng Create React App (CRA)
  withCredentials: true, // Cho phép gửi cookie (nếu backend có set cookie)
});


// ==========================
// Request Interceptor
// ==========================
// Mỗi khi gửi request, sẽ chạy qua đây trước
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("jwt");

    // Nếu có token thì gắn vào header Authorization
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    // Nếu có lỗi ngay ở bước chuẩn bị request thì reject
    return Promise.reject(error);
  }
);

// ==========================
// Response Interceptor
// ==========================
// Mỗi khi nhận response từ server thì chạy qua đây
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Luôn trả về response.data để khi gọi API chỉ cần dùng trực tiếp
    return response.data;
  },
  (error: AxiosError) => {
    // Lấy status code từ response
    const status = error.response?.status || 500;

    switch (status) {
      case 401: {
        // 401 = chưa đăng nhập hoặc token hết hạn
        toast.error("401 Unauthorized, please login.");
        // Trả về dữ liệu lỗi để phía gọi API biết mà xử lý
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
        // Các lỗi request sai dữ liệu
        return Promise.reject(error.response?.data);
      }
      default: {
        // Lỗi server hoặc không xác định
        toast.error("Something went wrong!");
        return Promise.reject(error.response?.data || error);
      }
    }
  }
);

export default instance;
