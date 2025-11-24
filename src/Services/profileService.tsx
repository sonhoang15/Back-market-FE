import axios from "../setup/axios";
import { Profile, OrderEmailPayload } from "./clientSevice";

export const getProfile = () => {
    return axios.get("/api/v1/profile");
};

export const updateProfile = (data: Profile) => {
    return axios.put("/api/v1/profile/update", data);
};

export const sendOrderEmail = (data: OrderEmailPayload) => {
    return axios.post("/api/v1/order/email", data);
};


export const saveOrder = async (payload: OrderEmailPayload) => {
    try {
        const res = await axios.post("/api/v1/orders/save", payload, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        return res;
    } catch (err) {
        return { EC: 1, EM: "Lỗi gọi API lưu đơn hàng!" };
    }
};

export const getAllOrders = async () => {
    return axios.get("/api/v1/orders/all");
};

export const getOrderDetail = async (id: number) => {
    return axios.get(`/api/v1/orders/detail/${id}`);
};

export const updateOrderStatus = async (id: number, status: string) => {
    return axios.put(`/api/v1/order/update-status/${id}`, { status });
};