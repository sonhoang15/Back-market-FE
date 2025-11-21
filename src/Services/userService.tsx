import axios from "../setup/axios"

interface User {
    id: number;
    email?: string;
    username?: string;
    phone?: string;
    address?: string;
    password?: string;
    [key: string]: any;
}


const RegisterService = (
    email: string,
    username: string,
    phone: string,
    password: string
): Promise<any> => {
    return axios.post("/api/v1/register", {
        email,
        username,
        phone,
        password,
    });
};


const LoginService = (
    valueLogin: string,
    password: string
): Promise<any> => {
    return axios.post("/api/v1/login", {
        valueLogin,
        password,
    });
};

const fetchAllUsers = (
    page: number,
    limit: number
): Promise<any> => {
    return axios.get(`/api/v1/user/read?page=${page}&limit=${limit}`);
};


const deleteUser = (
    user: { id: number }
): Promise<any> => {
    return axios.delete(`/api/v1/user/delete`, {
        data: { id: user.id },
    });
};

const fetchGroups = (): Promise<any> => {
    return axios.get(`/api/v1/group/read`);
};


const createNewUser = (
    userData: User
): Promise<any> => {
    return axios.post(`/api/v1/user/create`, { ...userData });
};


const updateUser = (
    userData: User
): Promise<any> => {
    return axios.put(`/api/v1/user/update`, { ...userData });
};


const getUserAccount = async (token?: string) => {
    return axios.get("/api/v1/account", {
        headers: {
            Authorization: `Bearer ${token || localStorage.getItem("jwt")}`,
        },
    });
};

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