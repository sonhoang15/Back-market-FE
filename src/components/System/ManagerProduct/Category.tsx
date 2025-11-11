import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../../../Services/adminService";
import ModalDelete from "./ModalDelete";


interface Category {
    id: number;
    name: string;
    description?: string;
    parentId?: number | null;

}

const Categories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [newName, setNewName] = useState("");
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editName, setEditName] = useState("");
    const [showDelete, setShowDelete] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const getAllCategories = async () => {
        try {
            setLoading(true);
            const res = await fetchCategories(); // gọi API
            if (res && Array.isArray(res.DT)) {
                setCategories(res.DT);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải danh mục!");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getAllCategories();
    }, []);

    // Tạo mới category
    const handleCreate = async () => {
        if (!newName.trim()) {
            toast.error("Tên danh mục không được để trống!");
            return;
        }

        try {
            const res = await createCategory(newName);

            // Dùng trực tiếp object trả về từ axios
            if (res.EC === 0) {
                setCategories([res.DT, ...categories]);
                setNewName("");
                toast.success(res.EM);
            } else {
                toast.error(res.EM);
            }
        } catch (error) {
            console.error("API error:", error);
            toast.error("Không thể thêm danh mục!");
        }
    };


    // Lưu chỉnh sửa
    const handleUpdate = async () => {
        if (!editingCategory) return;
        try {
            // ✅ gọi API wrapper thay vì axios trực tiếp
            const res = await updateCategory(editingCategory.id, editName);

            if (res && res.EC === 0) {
                toast.success("Cập nhật thành công!");
                getAllCategories(); // reload danh sách
                setEditingCategory(null);
                setEditName("");
            } else {
                toast.error(res.EM || "Không thể cập nhật");
            }
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi cập nhật danh mục!");
        }
    };


    const handleEdit = (cat: Category) => {
        setEditingCategory(cat);
        setEditName(cat.name);
    };

    // Xóa category
    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await deleteCategory(deleteId);
            if (res?.EC === 0) {
                setCategories(categories.filter(c => c.id !== deleteId));
                toast.success("Xóa thành công!");
            } else toast.error(res.EM || "Không thể xóa");
        } finally {
            setShowDelete(false);
        }
    };
    return (
        <>
            <div className="p-6 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Quản lý Danh mục</h1>

                {/* Thêm mới */}
                <div className="flex gap-2 mb-6">
                    <input
                        type="text"
                        placeholder="Tên danh mục mới"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                    <button
                        onClick={handleCreate}
                        className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
                    >
                        Thêm
                    </button>
                </div>

                {/* Bảng */}
                {loading ? (
                    <p>Đang tải...</p>
                ) : (
                    <table className="w-full border-collapse border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 text-left">ID</th>
                                <th className="border p-2 text-left">Tên danh mục</th>
                                <th className="border p-2 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(categories) && categories.length > 0 ? (
                                categories.map((cat) => (
                                    <tr key={cat.id}>
                                        <td className="border p-2">{cat.id}</td>
                                        <td className="border p-2">
                                            {editingCategory?.id === cat.id ? (
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="border p-1 rounded w-full"
                                                    aria-label="Tên danh mục"
                                                />
                                            ) : (
                                                cat.name
                                            )}
                                        </td>
                                        <td className="border p-2 flex gap-2 justify-center items-center">
                                            {editingCategory?.id === cat.id ? (
                                                <>
                                                    <button
                                                        onClick={handleUpdate}
                                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                                    >
                                                        Lưu
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingCategory(null)}
                                                        className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                                                    >
                                                        Hủy
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(cat)}
                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setDeleteId(cat.id);
                                                            setShowDelete(true);
                                                        }}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                                    >
                                                        Xóa
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center p-4">
                                        Không có danh mục nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
            <ModalDelete
                show={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={confirmDelete}
                title="Xóa danh mục"
                message="Bạn có chắc muốn xóa danh mục này?"
            />
        </>
    );
};

export default Categories;

