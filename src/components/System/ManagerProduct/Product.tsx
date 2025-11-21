import React, { useEffect, useState } from "react";
import {
    fetchAllProducts,
    updateProduct,
    deleteProduct,
} from "../../../Services/productService";
import { Product } from "./productTypes";
import { ProductTable } from "./ProductTable";
import { ProductEditModal } from "./ProductEditModal";
import { ProductVariantTable } from "./ProductVariantTable";
import { toast } from "react-toastify";
import { fetchCategories } from "../../../Services/adminService";
import ModalDelete from "./ModalDelete";

export const ProductPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setDeleteId(id);
        setShowDelete(true);
    };

    const loadProducts = async (keepSelected = true) => {
        const res = await fetchAllProducts();
        if (res?.EC === 0) {
            setProducts(res.DT);

            if (keepSelected && selectedProduct) {
                const updated = res.DT.find((p: Product) => p.id === selectedProduct.id);
                if (updated) setSelectedProduct(updated);
            }
        } else toast.error("Lỗi tải danh sách sản phẩm!");
    }
    useEffect(() => {
        loadProducts();
    }, []);

    const handleEdit = (product: Product) => setEditingProduct(product);

    const handleSaveEdit = async (formData: FormData) => {
        try {
            const res = await updateProduct(formData);

            if (res?.EC === 0) {
                toast.success("Cập nhật thành công!");

                await loadProducts();

                setEditingProduct(null);
            } else {
                toast.error(res?.EM || "Cập nhật thất bại");
            }
        } catch (error: any) {
            console.error("Lỗi khi gọi API updateProduct:", error);
            toast.error(error?.response?.EM || "Cập nhật thất bại");
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        const product = products.find(p => p.id === deleteId);
        const res = await deleteProduct(deleteId);
        if (res?.EC === 0) {
            toast.success(`Đã xóa sản phẩm "${product?.name}"`);
            loadProducts();
        } else toast.error(res?.EM);
        setShowDelete(false);
    };

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await fetchCategories();
                if (res?.EC === 0) setCategories(res.DT);
                else toast.error("Không thể tải danh mục!");
            } catch (error) {
                toast.error("Lỗi kết nối server!");
            }
        };

        loadCategories();
    }, []);

    return (
        <>
            <div className="p-4 space-y-6">
                <h1 className="text-xl font-bold mb-4">Danh sách sản phẩm</h1>

                <ProductTable
                    products={products}
                    onSelect={setSelectedProduct}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {selectedProduct && (
                    <div className="mt-8 p-4 border rounded-lg bg-gray-50">
                        <h2 className="text-xl font-semibold mb-2">{selectedProduct.name}</h2>
                        <p className="text-gray-600 mb-4">{selectedProduct.description}</p>

                        <ProductVariantTable
                            productId={selectedProduct.id}
                            variants={selectedProduct.variants || []}
                            onRefresh={() => loadProducts(true)}
                        />
                    </div>
                )}

                {editingProduct && (
                    <ProductEditModal
                        product={editingProduct}
                        categories={categories}
                        onClose={() => setEditingProduct(null)}
                        onSave={handleSaveEdit}
                    />
                )}
            </div>
            <ModalDelete
                show={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={confirmDelete}
                title="Xóa sản phẩm"
                message="Bạn có chắc muốn xóa sản phẩm này?"
            />
        </>
    );
};
