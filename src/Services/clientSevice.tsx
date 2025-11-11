// src/services/productApi.js
import axios from "axios";

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
