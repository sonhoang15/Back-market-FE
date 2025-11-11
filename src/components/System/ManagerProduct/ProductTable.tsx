import React, { useState } from "react";
import { Product } from "./productTypes";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

interface Props {
    products: Product[];
    onSelect: (product: Product) => void;
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
}

export const ProductTable: React.FC<Props> = ({
    products,
    onSelect,
    onEdit,
    onDelete,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 5;

    const totalPages = Math.ceil(products.length / perPage);
    const startIndex = (currentPage - 1) * perPage;
    const paginatedProducts = products.slice(startIndex, startIndex + perPage);

    const handlePrev = () => currentPage > 1 && setCurrentPage((p) => p - 1);
    const handleNext = () => currentPage < totalPages && setCurrentPage((p) => p + 1);

    return (
        <div className="border rounded-lg shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-2">ID</th>
                            <th className="p-2">Ảnh</th>
                            <th className="p-2">Tên</th>
                            <th className="p-2">Danh mục</th>
                            <th className="p-2">Nguồn</th>
                            <th className="p-2">Giá</th>
                            <th className="p-2 text-center">Kho</th>
                            <th className="p-2">Trạng thái</th>
                            <th className="p-2 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedProducts.map((p) => {
                            const img = p.thumbnail || null;

                            return (
                                <tr key={p.id} className="border-t hover:bg-gray-50">
                                    <td className="p-2">{p.id}</td>
                                    <td className="p-2">
                                        {img ? (
                                            <img
                                                src={img}
                                                alt={p.name}
                                                className="w-14 h-14 object-cover rounded-md border"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 flex items-center justify-center bg-gray-100 text-gray-400 border rounded-md">
                                                No Img
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-2 font-medium">{p.name}</td>
                                    <td className="p-2">{p.category?.name?.trim() || "—"}</td>
                                    <td className="p-2 capitalize">{p.source}</td>
                                    <td className="p-2">
                                        {(p.price_min ?? 0).toLocaleString()}₫ - {(p.price_max ?? 0).toLocaleString()}₫
                                    </td>
                                    <td className="p-2 text-center">{p.totalStock ?? 0}</td>
                                    <td className="p-2">{p.status}</td>
                                    <td className="p-2 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => onSelect(p)}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Xem chi tiết"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => onEdit(p)}
                                                className="text-green-600 hover:text-green-800"
                                                title="Sửa sản phẩm"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => onDelete(p.id)}
                                                className="text-red-600 hover:text-red-800"
                                                title="Xóa sản phẩm"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {paginatedProducts.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="text-center py-4 text-gray-500 italic"
                                >
                                    Không có sản phẩm nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center px-4 py-3 text-sm bg-gray-50 border-t">
                    <p>Trang {currentPage}/{totalPages}</p>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded border ${currentPage === 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-100"
                                }`}
                        >
                            Trước
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded border ${currentPage === totalPages
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-100"
                                }`}
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
