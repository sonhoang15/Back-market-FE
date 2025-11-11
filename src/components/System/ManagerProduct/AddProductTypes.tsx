import { useEffect, useState } from "react";
import { fetchCategories } from "../../../Services/adminService";
import { createProduct } from "../../../Services/productService";
import { toast } from "react-toastify";

export interface Category {
    id: number;
    name: string;
}

export interface Variant {
    size: string;
    color: string;
    price: number | "";
    quantity: number | "";
    images: string[];
}

export interface ProductFormData {
    name: string;
    description: string;
    is_active: boolean;
    category_id: number | "";
    price_min: "",
    thumbnail: string[];
    variants: Variant[];
}

export const useAddProduct = () => {
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        description: "",
        is_active: true,
        price_min: "",
        category_id: "",
        thumbnail: [],
        variants: [],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const loadCategories = async () => {
            const res = await fetchCategories();
            if (res && res.EC === 0) {
                setCategories(res.DT);
            } else {
                console.warn(" Không thể load danh mục:", res?.EM);
            }
        };
        loadCategories();
    }, []);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Tên sản phẩm là bắt buộc";
        if (!formData.category_id) newErrors.category_id = "Danh mục là bắt buộc";
        if (!formData.thumbnail.length) newErrors.thumbnail = "Ảnh sản phẩm là bắt buộc";
        if (!formData.variants.length) newErrors.variants = "Cần ít nhất 1 biến thể";

        formData.variants.forEach((v, idx) => {
            if (!v.size) newErrors[`variant_${idx}_size`] = "Size là bắt buộc";
            if (!v.color) newErrors[`variant_${idx}_color`] = "Màu là bắt buộc";
            if (!v.price) newErrors[`variant_${idx}_price`] = "Giá là bắt buộc";
            if (!v.quantity) newErrors[`variant_${idx}_quantity`] = "Số lượng là bắt buộc";
        });

        return newErrors;
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            // 🔹 Chuyển thumbnail (chỉ lấy ảnh đầu tiên)
            let thumbnailBase64 = "";
            if (formData.thumbnail[0]) {
                thumbnailBase64 = formData.thumbnail[0];
            }

            const productRes = await createProduct({
                ...formData,
                thumbnail: formData.thumbnail[0], // ảnh đầu tiên base64
            });

            if (productRes?.EC !== 0) {
                toast.error("Lỗi tạo sản phẩm: " + productRes.EM);
                return;
            }

            const product_id = productRes.DT?.id;
            console.log("✅ Product Created ID:", product_id);

            toast.success(" Thêm sản phẩm + biến thể thành công!");
            setErrors({});

            setFormData({
                name: "",
                description: "",
                is_active: true,
                category_id: "",
                price_min: "",
                thumbnail: [],
                variants: [],
            });

        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm:", error);
            toast.error("Lỗi hệ thống khi thêm sản phẩm!");
        }
    };
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const base64Files = await Promise.all(files.map(f => fileToBase64(f)));
            setFormData(prev => ({ ...prev, thumbnail: base64Files }));
        }
    };

    const removeImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            thumbnail: prev.thumbnail.filter((_, i) => i !== index),
        }));
    };

    const addVariant = () => {
        setFormData((prev) => ({
            ...prev,
            variants: [...prev.variants, { size: "", color: "", price: "", quantity: "", images: [] }],
        }));
    };

    const updateVariant = (index: number, key: keyof Variant, value: any) => {
        setFormData((prev) => {
            const newVariants = [...prev.variants];
            (newVariants[index] as any)[key] = value;
            return { ...prev, variants: newVariants };
        });
    };

    const removeVariant = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index),
        }));
    };

    const handleVariantFileChange = async (index: number, files: File[]) => {
        const base64Files = await Promise.all(files.map(f => fileToBase64(f)));
        setFormData(prev => {
            const newVariants = [...prev.variants];
            newVariants[index].images.push(...base64Files);
            return { ...prev, variants: newVariants };
        });
    };

    return {
        formData,
        setFormData,
        errors,
        setErrors,
        categories,
        handleInputChange,
        handleCheckboxChange,
        handleSubmit,
        handleFileChange,
        removeImage,
        addVariant,
        updateVariant,
        removeVariant,
        handleVariantFileChange,
    };
};
