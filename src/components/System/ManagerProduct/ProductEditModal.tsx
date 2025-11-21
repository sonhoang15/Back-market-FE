import React, { useState } from "react";
import { Product } from "./productTypes";
import { toast } from "react-toastify";

interface Props {
    product: Product;
    categories?: { id: number; name: string }[];
    onClose: () => void;
    onSave: (data: FormData) => void;
}

export const ProductEditModal: React.FC<Props> = ({
    product,
    categories = [],
    onClose,
    onSave,
}) => {
    const [form, setForm] = useState<Product>({ ...product });
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name === "category" && value) {
            setForm((prev) => ({
                ...prev,
                category: { id: Number(value), name: prev.category?.name || "" },
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnailFile(file);
            setForm((prev) => ({ ...prev, thumbnail: URL.createObjectURL(file) }));
        }
    };

    const handleSave = async () => {
        if (!product.id) {
            toast.error("Không tìm thấy ID sản phẩm!");
            return;
        }

        const formData = new FormData();
        formData.append("id", product.id.toString());
        formData.append("name", form.name);
        if (form.description) formData.append("description", form.description);
        if (form.category?.id) formData.append("category_id", form.category.id.toString());
        if (form.price_min !== undefined) formData.append("price_min", form.price_min.toString());
        if (form.price_max !== undefined) formData.append("price_max", form.price_max.toString());
        formData.append("status", form.status ?? "draft");
        formData.append("is_active", String(form.is_active ?? true));
        if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

        await onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-[450px] shadow-2xl border border-gray-200 animate-fadeIn">
                <h2 className="text-xl font-semibold text-gray-800 mb-5 border-b pb-3">
                    Chỉnh sửa sản phẩm
                </h2>

                <div className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="thumbnail-image" className="block text-sm font-medium text-gray-600 mb-1">
                            Ảnh sản phẩm
                        </label>
                        <div className="flex items-center gap-4">
                            {form.thumbnail ? (
                                <img
                                    src={form.thumbnail}
                                    alt={form.name || "Ảnh sản phẩm"}
                                    className="w-24 h-24 object-cover rounded-lg border"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-lg border text-gray-400">
                                    No Image
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="text-sm file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                id="thumbnail-image"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Tên sản phẩm
                        </label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Nhập tên sản phẩm"
                            className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-600 mb-1">
                            Danh mục
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={form.category?.id || ""}
                            onChange={handleChange}
                            className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Giá thấp nhất
                            </label>
                            <input
                                name="price_min"
                                type="number"
                                value={form.price_min ?? ""}
                                onChange={handleChange}
                                placeholder="Nhập giá thấp nhất"
                                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Giá cao nhất
                            </label>
                            <input
                                name="price_max"
                                type="number"
                                value={form.price_max ?? ""}
                                onChange={handleChange}
                                placeholder="Nhập giá cao nhất"
                                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-1">
                            Trạng thái
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                        >
                            <option value="active">Hoạt động</option>
                            <option value="draft">Nháp</option>
                            <option value="hidden">Ẩn</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
                    >
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
};
