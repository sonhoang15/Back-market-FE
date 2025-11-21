import axios from "../setup/axios";

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




const createCategory = async (name: string, parentId: number | null = null, description = '', source_type = 'manual') => {
    return axios.post("/api/v1/category/create", { name, parentId, description, source_type });
};

const fetchCategories = async () => {
    return await axios.get("/api/v1/category/read");
};

const updateCategory = async (id: number, name: string, parentId: number | null = null, description = '', source_type?: string) => {
    return axios.put(`/api/v1/category/update/${id}`, { name, parentId, description, source_type });
};

const deleteCategory = (id: number) => {
    return axios.delete(`/api/v1/category/delete/${id}`);
}

export {
    updateCategory,
    deleteCategory,
    fetchCategories,
    createCategory,
};

