import { useState, useMemo } from "react";

export interface VariantItem {
    id?: number;
    color: string | null;
    size: string | null;
    price: number | string | null;
    image: string;
    stock: number;
}

export const useProductVariants = (variants: VariantItem[] = [], productPrice?: number | string) => {
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    // Nhóm variant theo màu
    const groupedByColor = useMemo(() => {
        return variants.reduce((acc: Record<string, VariantItem[]>, v) => {
            if (!v.color) return acc;
            if (!acc[v.color]) acc[v.color] = [];
            acc[v.color].push(v);
            return acc;
        }, {});
    }, [variants]);

    // Tính size khả dụng cho màu đã chọn
    const availableSizes = useMemo(() => {
        if (!selectedColor) return [];

        return (groupedByColor[selectedColor] || [])
            .filter(v => v.stock > 0)
            .map(v => v.size || "Free size");
    }, [selectedColor, groupedByColor]);

    // Lấy variant trùng với màu + size
    const matchedVariant = useMemo(() => {
        return variants.find(v =>
            // Nếu có màu thì bắt buộc match màu, nếu không có màu thì bỏ qua
            (selectedColor ? v.color === selectedColor : true) &&

            // Nếu có size thì match size, nếu sản phẩm không có size thì bỏ qua điều kiện size
            (selectedSize ? v.size === selectedSize : true)
        ) || null;
    }, [selectedColor, selectedSize, variants]);

    // Tính stock
    const stock = matchedVariant?.stock ?? 0;

    // Xử lý giá an toàn
    const price = matchedVariant?.price ?? productPrice ?? 0;

    // Danh sách màu còn hàng
    const availableColors = Object.keys(groupedByColor).filter(color =>
        groupedByColor[color].some(v => v.stock > 0)
    );

    // Ảnh đại diện theo màu (hoặc variant)
    const getImageByColor = (color: string) => {
        const item = groupedByColor[color]?.[0];
        return item?.image ?? null;
    };

    return {
        // state
        selectedColor,
        setSelectedColor,
        selectedSize,
        setSelectedSize,

        // data
        groupedByColor,
        availableSizes,
        availableColors,
        matchedVariant,

        // computed values
        stock,
        price,

        // helper
        getImageByColor,
    };
};

