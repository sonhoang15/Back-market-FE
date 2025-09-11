import React, { useState, useEffect } from "react";
import { createProduct, fetchCategories } from "../../../Services/adminService";

interface Category {
    id: number;
    name: string;
}

interface ProductFormData {
    name: string;
    price: number | "";
    quantity: number | "";
    size: string;
    color: string;
    description: string;
    image: File | null;
    active: boolean;
    categoryId: number | ""; // 👈 thêm categoryId
}

export default function AddProduct() {
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        price: "",
        quantity: "",
        size: "",
        color: "",
        description: "",
        image: null,
        active: true,
        categoryId: 0,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [categories, setCategories] = useState<Category[]>([]);


    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await fetchCategories();
                setCategories(res.data);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        loadCategories();
    }, []);
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "price" || name === "quantity"
                    ? value === "" ? "" : Number(value)
                    : value,
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Tên sản phẩm là bắt buộc";
        if (!formData.price) newErrors.price = "Giá là bắt buộc";
        if (!formData.quantity) newErrors.quantity = "Số lượng là bắt buộc";
        if (!formData.size.trim()) newErrors.size = "Size là bắt buộc";
        if (!formData.color.trim()) newErrors.color = "Màu là bắt buộc";
        if (!formData.categoryId) newErrors.categoryId = "Danh mục là bắt buộc";
        if (!formData.image) newErrors.image = "Ảnh là bắt buộc";
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("price", String(formData.price));
            formDataToSend.append("quantity", String(formData.quantity));
            formDataToSend.append("size", formData.size);
            formDataToSend.append("color", formData.color);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("active", String(formData.active));
            formDataToSend.append("categoryId", String(formData.categoryId));

            if (formData.image) {
                formDataToSend.append("image", formData.image);
            }

            const res = await createProduct(formDataToSend);

            console.log("Product created:", res.data);
            alert("Thêm sản phẩm thành công!");
        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm:", error);
            alert("Thêm sản phẩm thất bại!");
        }
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({
                ...prev,
                image: e.target.files![0],
            }));
        }
    };
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            categoryId: e.target.value ? Number(e.target.value) : "",
        }));
        setErrors((prev) => ({ ...prev, categoryId: "" }));
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
            <h2 className="text-2xl font-bold mb-4">Thêm sản phẩm mới</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tên sản phẩm */}
                <div>
                    <label className="block font-medium">Tên sản phẩm *</label>
                    <input
                        type="text"
                        name="name"
                        className="w-full border p-2 rounded"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    {errors.name && <p className="text-red-500">{errors.name}</p>}
                </div>

                {/* Giá */}
                <div>
                    <label className="block font-medium">Giá *</label>
                    <input
                        type="number"
                        name="price"
                        className="w-full border p-2 rounded"
                        value={formData.price}
                        onChange={handleInputChange}
                    />
                    {errors.price && <p className="text-red-500">{errors.price}</p>}
                </div>

                {/* Số lượng */}
                <div>
                    <label className="block font-medium">Số lượng *</label>
                    <input
                        type="number"
                        name="quantity"
                        className="w-full border p-2 rounded"
                        value={formData.quantity}
                        onChange={handleInputChange}
                    />
                    {errors.quantity && <p className="text-red-500">{errors.quantity}</p>}
                </div>

                {/* Danh mục sản phẩm */}
                <div>
                    <label className="block font-medium">Danh mục *</label>
                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleCategoryChange}
                        className="border rounded p-2 w-full"
                    >
                        <option value="">-- Chọn danh mục --</option>
                        {Array.isArray(categories) && categories.length > 0 &&
                            categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))
                        }
                    </select>

                    {errors.categoryId && (
                        <p className="text-red-500">{errors.categoryId}</p>
                    )}
                </div>

                {/* Size */}
                <div>
                    <label className="block font-medium">Size *</label>
                    <input
                        type="text"
                        name="size"
                        className="w-full border p-2 rounded"
                        value={formData.size}
                        onChange={handleInputChange}
                    />
                    {errors.size && <p className="text-red-500">{errors.size}</p>}
                </div>

                {/* Màu */}
                <div>
                    <label className="block font-medium">Màu *</label>
                    <input
                        type="text"
                        name="color"
                        className="w-full border p-2 rounded"
                        value={formData.color}
                        onChange={handleInputChange}
                    />
                    {errors.color && <p className="text-red-500">{errors.color}</p>}
                </div>

                {/* Ảnh */}
                <div>
                    <label className="block font-medium">Ảnh (Upload) *</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full border p-2 rounded"
                    />
                    {errors.image && <p className="text-red-500">{errors.image}</p>}

                    {formData.image && (
                        <div className="mt-2">
                            <img
                                src={URL.createObjectURL(formData.image)}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded border"
                            />
                        </div>
                    )}
                </div>

                {/* Mô tả */}
                <div>
                    <label className="block font-medium">Mô tả</label>
                    <textarea
                        name="description"
                        className="w-full border p-2 rounded"
                        rows={3}
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Kích hoạt */}
                <div>
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            name="active"
                            checked={formData.active}
                            onChange={handleCheckboxChange}
                            className="mr-2"
                        />
                        Kích hoạt sản phẩm
                    </label>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Lưu sản phẩm
                </button>
            </form>
        </div>
    );
}
