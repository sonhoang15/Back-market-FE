// ProductVariantTable.tsx
import React, { useState, useEffect } from "react";
import {
    createVariant as apiCreateVariant,
    updateVariant as apiUpdateVariant,
    deleteVariant as apiDeleteVariant,
} from "../../../Services/productService";
import { ProductVariant } from "./productTypes";
import { toast } from "react-toastify";
import ModalDelete from "./ModalDelete";

interface Props {
    variants: ProductVariant[];
    productId: number;
    onRefresh: () => void; // gọi để reload variants sau thay đổi
}

const emptyForm = {
    id: undefined as number | undefined,
    product_id: undefined as number | undefined,
    name: "",
    color: "",
    size: "",
    price: "" as string | number,
    stock: "" as string | number,
    source: "" as string | undefined,
    source_url: "" as string | undefined,
    source_type: "" as string | undefined,
};

export const ProductVariantTable: React.FC<Props> = ({
    variants,
    productId,
    onRefresh,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ ...emptyForm });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null); // preview (existing url or local object url)
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        // reset when modal closed
        if (!isOpen) {
            setForm({ ...emptyForm });
            setPreviewUrl(null);
            setFile(null);
            setIsEditing(false);
        }
    }, [isOpen]);

    const openAdd = () => {
        setForm({ ...emptyForm, product_id: productId });
        setPreviewUrl(null);
        setFile(null);
        setIsEditing(false);
        setIsOpen(true);
    };

    const openEdit = (v: ProductVariant) => {
        setForm({
            id: v.id,
            product_id: productId,
            name: v.name ?? "",
            color: v.color ?? "",
            size: v.size ?? "",
            price: v.price ?? "",
            stock: v.stock ?? "",
            source: (v as any).source ?? "",
            source_url: (v as any).source_url ?? "",
            source_type: (v as any).source_type ?? "",
        });
        // preview có thể là v.image (url) hoặc v.images[0]
        setPreviewUrl((v as any).image ?? (v as any).images?.[0] ?? null);
        setFile(null);
        setIsEditing(true);
        setIsOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        if (f) {
            setFile(f);
            setPreviewUrl(URL.createObjectURL(f));
        }
    };

    const handleInput = (k: string, val: any) => {
        setForm((p) => ({ ...p, [k]: val }));
    };

    const fileToBase64 = (f: File) =>
        new Promise<string>((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(String(r.result));
            r.onerror = reject;
            r.readAsDataURL(f);
        });

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setLoading(true);

        try {
            if (!isEditing) {
                // --- Thêm mới ---
                const payload: any = {
                    product_id: productId,
                    color: form.color,
                    size: form.size,
                    price: Number(form.price || 0),
                    stock: Number(form.stock || 0),
                    source: form.source,
                    source_url: form.source_url,
                };

                if (file) {
                    const b64 = await fileToBase64(file);
                    payload.image = b64;
                } else if (previewUrl && previewUrl.startsWith("data:")) {
                    payload.image = previewUrl;
                }

                const res = await apiCreateVariant(payload);
                if (res?.EC === 0) {
                    toast.success("🎉 Tạo biến thể thành công!");
                    onRefresh?.();       // ✅ Gọi callback để cập nhật danh sách
                    setIsOpen(false);    // ✅ Đóng modal
                } else {
                    toast.error("❌ Lỗi tạo biến thể: " + (res?.EM ?? "Unknown"));
                }
            } else {
                // --- Cập nhật ---
                const fm = new FormData();
                if (form.id) fm.append("id", String(form.id));
                fm.append("product_id", String(productId));
                fm.append("name", form.name ?? "");
                fm.append("price", String(form.price ?? 0));
                fm.append("stock", String(form.stock ?? 0));
                if (form.color) fm.append("color", String(form.color));
                if (form.size) fm.append("size", String(form.size));
                if (form.source) fm.append("source", String(form.source));
                if (form.source_url) fm.append("source_url", String(form.source_url));
                if (file) fm.append("image", file);

                const res = await apiUpdateVariant(fm);

                if (res?.EC === 0) {
                    toast.success("✏️ Cập nhật biến thể thành công!");
                    onRefresh?.();       // ✅ Cập nhật lại danh sách
                    setIsOpen(false);    // ✅ Đóng modal
                } else {
                    toast.error("❌ Lỗi cập nhật: " + (res?.EM ?? "Unknown"));
                }
            }
        } catch (err) {
            console.error("Variant submit error:", err);
            toast.error("⚠️ Lỗi khi lưu biến thể");
        } finally {
            setLoading(false);
        }
    };


    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await apiDeleteVariant(deleteId);
            if (res?.EC === 0) {
                toast.success("Xóa thành công!");
                onRefresh();
            } else toast.error(res?.EM ?? "Xóa thất bại");
        } finally {
            setShowDelete(false);
        }
    };

    // Nhóm các variant theo màu
    const variantsByColor = variants.reduce((acc: Record<string, ProductVariant[]>, v) => {
        const colorKey = v.color || "unknown";
        if (!acc[colorKey]) acc[colorKey] = [];
        acc[colorKey].push(v);
        return acc;
    }, {});

    // Tạo mảng các nhóm variant để render
    const variantGroups = Object.values(variantsByColor).flatMap(colorGroup => {
        // Sắp xếp theo size hoặc theo một tiêu chí nào đó nếu cần
        return colorGroup.map((variant, index) => ({
            ...variant,
            // Đánh dấu đây có phải là variant đầu tiên của màu này không
            isFirstOfColor: index === 0
        }));
    });


    return (
        <>
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Biến thể</h3>
                    <button
                        onClick={openAdd}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        + Thêm biến thể
                    </button>
                </div>

                {!variants?.length ? (
                    <p className="text-gray-500 mt-2">Không có biến thể</p>
                ) : (
                    <div className="overflow-x-auto border rounded">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100 text-left">
                                <tr>
                                    <th className="p-2">ID</th>
                                    <th className="p-2">Tên</th>
                                    <th className="p-2">Màu</th>
                                    <th className="p-2">Size</th>
                                    <th className="p-2">Giá</th>
                                    <th className="p-2">Kho</th>
                                    <th className="p-2">Ảnh</th>
                                    <th className="p-2">Nguồn</th>
                                    <th className="p-2">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {variantGroups.map((v) => (
                                    <tr key={v.id} className="border-t hover:bg-gray-50">
                                        <td className="p-2">{v.id}</td>
                                        <td className="p-2 font-medium">{v.name}</td>
                                        <td className="p-2">{v.color ?? "-"}</td>
                                        <td className="p-2">{v.size ?? "-"}</td>
                                        <td className="p-2">
                                            {v.price ? `${Number(v.price).toLocaleString()}₫` : "-"}
                                        </td>
                                        <td className="p-2">{v.stock ?? "-"}</td>
                                        <td className="p-2">
                                            {v.isFirstOfColor && ((v as any).image || (v as any).images?.[0]) ? (
                                                <img
                                                    src={(v as any).image ?? (v as any).images?.[0]}
                                                    alt={v.name ?? "variant"}
                                                    className="h-10 w-10 rounded object-cover"
                                                />
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>
                                        <td className="p-2">
                                            {v.source_url ? (
                                                <a
                                                    href={v.source_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    Link
                                                </a>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td className="p-2">
                                            <div className="flex gap-2">
                                                <button
                                                    className="px-2 py-1 text-sm bg-yellow-500 text-white rounded"
                                                    onClick={() => openEdit(v)}
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                                                    onClick={() => {
                                                        setDeleteId(v.id!);
                                                        setShowDelete(true);
                                                    }}
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal */}
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-4">
                            <h4 className="text-lg font-semibold mb-3">
                                {isEditing ? "Sửa biến thể" : "Thêm biến thể"}
                            </h4>

                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Tên */}
                                    <div>
                                        <label htmlFor="variant-name" className="block text-sm font-medium mb-1">
                                            Tên biến thể
                                        </label>
                                        <input
                                            id="variant-name"
                                            value={form.name ?? ""}
                                            onChange={(e) => handleInput("name", e.target.value)}
                                            className="border p-2 rounded w-full"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Để trống = tự sinh tên</p>
                                    </div>

                                    {/* Màu */}
                                    <div>
                                        <label htmlFor="variant-color" className="block text-sm font-medium mb-1">
                                            Màu
                                        </label>
                                        <input
                                            id="variant-color"
                                            value={form.color ?? ""}
                                            onChange={(e) => handleInput("color", e.target.value)}
                                            className="border p-2 rounded w-full"
                                        />
                                    </div>

                                    {/* Size */}
                                    <div>
                                        <label htmlFor="variant-size" className="block text-sm font-medium mb-1">
                                            Size
                                        </label>
                                        <input
                                            id="variant-size"
                                            value={form.size ?? ""}
                                            onChange={(e) => handleInput("size", e.target.value)}
                                            className="border p-2 rounded w-full"
                                        />
                                    </div>

                                    {/* Giá */}
                                    <div>
                                        <label htmlFor="variant-price" className="block text-sm font-medium mb-1">
                                            Giá (₫)
                                        </label>
                                        <input
                                            id="variant-price"
                                            type="number"
                                            value={form.price ?? ""}
                                            onChange={(e) => handleInput("price", Number(e.target.value))}
                                            className="border p-2 rounded w-full"
                                        />
                                    </div>

                                    {/* Stock */}
                                    <div>
                                        <label htmlFor="variant-stock" className="block text-sm font-medium mb-1">
                                            Kho (Stock)
                                        </label>
                                        <input
                                            id="variant-stock"
                                            type="number"
                                            value={form.stock ?? ""}
                                            onChange={(e) => handleInput("stock", Number(e.target.value))}
                                            className="border p-2 rounded w-full"
                                        />
                                    </div>

                                    {/* Nguồn */}
                                    <div>
                                        <label htmlFor="variant-source-type" className="block text-sm font-medium mb-1">
                                            Nguồn
                                        </label>
                                        <input
                                            id="variant-source-type"
                                            value={form.source_type ?? ""}
                                            onChange={(e) => handleInput("source_type", e.target.value)}
                                            className="border p-2 rounded w-full"
                                        />
                                    </div>

                                    {/* Source URL */}
                                    <div className="col-span-2">
                                        <label htmlFor="variant-source-url" className="block text-sm font-medium mb-1">
                                            Source URL
                                        </label>
                                        <input
                                            id="variant-source-url"
                                            value={form.source_url ?? ""}
                                            onChange={(e) => handleInput("source_url", e.target.value)}
                                            className="border p-2 rounded w-full"
                                        />
                                    </div>
                                </div>

                                {/* Ảnh */}
                                <div>
                                    <label htmlFor="variant-image" className="block text-sm font-medium mb-1">
                                        Ảnh (upload mới để thay thế)
                                    </label>
                                    <input
                                        id="variant-image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />

                                    {previewUrl ? (
                                        <div className="mt-2">
                                            <img
                                                src={previewUrl}
                                                alt="Xem trước ảnh biến thể"
                                                className="h-24 w-24 object-cover rounded"
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500 mt-1">Không có ảnh</div>
                                    )}
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="px-3 py-1 rounded border"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-1 bg-green-600 text-white rounded"
                                    >
                                        {loading ? "Đang lưu..." : isEditing ? "Cập nhật" : "Tạo"}
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                )}
            </div>
            <   ModalDelete
                show={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={confirmDelete}
                title="Xóa biến thể"
                message="Bạn có chắc muốn xóa biến thể này?"
            />
        </>
    );

};

export default ProductVariantTable;
