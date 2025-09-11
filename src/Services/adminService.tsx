import axios from "../setup/axios";

// Interface cho Product (phục vụ admin CRUD)
export interface ProductData {
    id?: number;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    description: string;
    image?: File | string | null;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
}

//  Tạo sản phẩm mới (có ảnh -> multipart/form-data)
const createProduct = (data: FormData): Promise<any> => {
    return axios.post("/api/v1/product/create", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
//  Lấy tất cả sản phẩm (có thể thêm phân trang/filter sau)
const fetchAllProducts = (): Promise<any> => {
    return axios.get("/api/v1/product/read");
};

//  Xoá 1 sản phẩm
const deleteProduct = (id: number): Promise<any> => {
    return axios.delete(`/api/v1/product/delete`, { data: { id } });
};

//  Cập nhật sản phẩm
const updateProduct = (product: ProductData): Promise<any> => {
    const formData = new FormData();
    if (product.id) formData.append("id", String(product.id));
    formData.append("name", product.name);
    formData.append("price", String(product.price));
    formData.append("quantity", String(product.quantity));
    formData.append("size", product.size);
    formData.append("color", product.color);
    formData.append("description", product.description);
    formData.append("active", String(product.active));

    if (product.image instanceof File) {
        formData.append("image", product.image);
    }

    return axios.put(`/api/v1/product/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

const createCategory = (name: string) => {
    return axios.post("/api/v1/category/create", { name });
};

// API lấy tất cả category
const fetchCategories = () => {
    return axios.get("/api/v1/categories");
};

export {
    fetchCategories,
    createProduct,
    fetchAllProducts,
    deleteProduct,
    updateProduct,
    createCategory,
};

