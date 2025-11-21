import axios from "../setup/axios";
import instance from "../setup/axios";
export interface ProductVariantData {
    id?: number;
    product_id?: number;
    name: string;
    color?: string | null;
    size?: string | null;
    price: number;
    stock: number;
    image?: string | null;
    source_url?: string;
    created_at?: string;
    updated_at?: string;
    source_type?: string;
}

export interface ProductData {
    id?: number;
    name: string;
    description?: string;
    thumbnail?: string | null;
    category_id?: number;
    source?: "manual" | "crawl";
    source_url?: string;
    price_min?: number;
    price_max?: number;
    is_active?: boolean;
    status?: "draft" | "published" | "hidden";
    manual_override?: boolean;
    sync_status?: string;
    last_crawled_at?: string;
    created_at?: string;
    updated_at?: string;
    variants?: ProductVariantData[];
}

function createProduct(data: any): Promise<any> {
    return axios.post("/api/v1/product/create", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

const createVariant = async (data: any) => {
    try {
        const res = await axios.post(`/api/v1/variant/create`, data);
        return res;
    } catch (error: any) {
        console.error(" createVariant error:", error.response?.data || error.message);
        return { EC: 1, EM: "Lỗi kết nối server", DT: null };
    }
};


const fetchAllProducts = async () => {
    try {
        const res = await instance.get("/api/v1/product/read");
        return res;
    } catch (error) {
        console.error(" getAllProductService error:", error);
        return null;
    }
};

const updateProduct = (formData: FormData) => {

    const productId = formData.get("id")?.toString();
    if (!productId) {
        throw new Error("Product ID missing in FormData!");
    }

    return axios.put(`/api/v1/product/update/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};


const deleteProduct = (id: number): Promise<any> => {
    return axios.delete(`/api/v1/product/delete/${id}`);
};
const fetchVariantsByProduct = (product_id: number): Promise<any> => {
    return axios.get(`/api/v1/variant/read/${product_id}`);
};

const getProductById = (product_id: number): Promise<any> => {
    return axios.get(`/api/v1/product/read/${product_id}`);
};

const updateVariant = (variant: FormData | ProductVariantData): Promise<any> => {
    let formData: FormData;
    let variantId: number | string | undefined;

    if (variant instanceof FormData) {
        formData = variant;

        variantId = formData.get("id") as string | undefined;
    } else {
        formData = new FormData();
        if (variant.id) formData.append("id", String(variant.id));
        if (variant.product_id) formData.append("product_id", String(variant.product_id));
        formData.append("name", variant.name);
        formData.append("price", String(variant.price));
        formData.append("stock", String(variant.stock));
        if (variant.color) formData.append("color", variant.color);
        if (variant.size) formData.append("size", variant.size);
        if (variant.source_url) formData.append("source_url", variant.source_url);
        variantId = variant.id;
    }


    return axios.put(`/api/v1/variant/update/${variantId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

const deleteVariant = async (id: number) => {
    try {
        const res = await axios.delete(`/api/v1/variant/delete/${id}`);

        console.log("🟢 deleteVariant response:", res.data);
        return res;
    } catch (err: any) {
        console.error(" apiDeleteVariant error:", err);
        return {
            EC: 1,
            EM: err.response?.EM || err.response?.message || err.message || "Request failed",
            DT: null,
        };
    }
};

export {
    fetchAllProducts,
    updateProduct,
    deleteProduct,
    fetchVariantsByProduct,
    updateVariant,
    deleteVariant,
    createProduct,
    createVariant,
    getProductById,
};
