// import axios from "axios";
import axios from "../setup/axios"

// Kiểu cho user
interface User {
    id: number;
    email?: string;
    username?: string;
    phone?: string;
    address?: string;
    password?: string;
    [key: string]: any;
}

// Kiểu cho đăng ký
const RegisterService = (
    email: string,
    username: string,
    phone: string,
    address: string,
    password: string
): Promise<any> => {
    return axios.post("/api/v1/register", {
        email,
        username,
        phone,
        address,
        password,
    });
};

// Kiểu cho đăng nhập
const LoginService = (
    valueLogin: string,
    password: string
): Promise<any> => {
    return axios.post("/api/v1/login", {
        valueLogin,
        password,
    });
};

// Lấy danh sách người dùng
const fetchAllUsers = (
    page: number,
    limit: number
): Promise<any> => {
    return axios.get(`/api/v1/user/read?page=${page}&limit=${limit}`);
};

// Xoá người dùng
const deleteUser = (
    user: { id: number }
): Promise<any> => {
    return axios.delete(`/api/v1/user/delete`, {
        data: { id: user.id },
    });
};

// Lấy danh sách nhóm
const fetchGroups = (): Promise<any> => {
    return axios.get(`/api/v1/group/read`);
};

// Tạo người dùng mới
const createNewUser = (
    userData: User
): Promise<any> => {
    return axios.post(`/api/v1/user/create`, { ...userData });
};

// Cập nhật người dùng
const updateUser = (
    userData: User
): Promise<any> => {
    return axios.put(`/api/v1/user/update`, { ...userData });
};

// Lấy thông tin tài khoản
const getUserAccount = (): Promise<any> => {
    return axios.get(`/api/v1/account`);
};

// Đăng xuất
const logOutUser = (): Promise<any> => {
    return axios.post(`/api/v1/logout`);
};
export {
    RegisterService,
    LoginService,
    fetchAllUsers,
    deleteUser,
    fetchGroups,
    createNewUser,
    updateUser,
    getUserAccount,
    logOutUser
}