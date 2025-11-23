
import axios from "axios";

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