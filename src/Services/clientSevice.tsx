import axios from "../setup/axios";

export interface Profile {
    username?: string;
    birthday?: string;
    phone?: string;
    email?: string;
    province?: string;
    district?: string;
    ward?: string;
    address?: string;
}

export interface OrderEmailPayload {
    email: string;
    username: string;
    phone: string;
    address: string;
    province: string;
    district: string;
    ward: string;
    note?: string;
    payment: string;
    items: any[];
    total: number;
}


export const getProductsByCategory = async (category_id: number) => {
    try {
        const res = await axios.get(`/api/v1/product/by-category-advanced/${category_id}`);
        if (res.data.EC === 0) {
            return res.data.DT.map((p: any) => ({
                id: p.id,
                name: p.name,
                price: p.price_min ? `${Number(p.price_min).toLocaleString()}₫` : "0₫",
                img: p.thumbnail || (p.variants[0]?.image ?? ""),
                thumbnails: p.variants?.map((v: any) => v.image).filter(Boolean) || [],
            }));
        } else {
            return [];
        }
    } catch (error) {
        console.error("Lỗi getProductsByCategory:", error);
        return [];
    }
};

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
        return res.data;
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

export const getBestSeller = (limit = 8) => {
    return axios.get(`/api/v1/product/best-seller?limit=${limit}`);
};

export const getNewestProducts = (limit = 8) => {
    return axios.get(`/api/v1/product/newest?limit=${limit}`);
};

export const searchProducts = async (keyword: string) => {
    try {
        const res = await axios.get(`/api/v1/product/search`, {
            params: { q: keyword },
        });
        return res.data;
    } catch (error) {
        console.log("Search API error", error);
        return { EC: 1, DT: [] };
    }
};