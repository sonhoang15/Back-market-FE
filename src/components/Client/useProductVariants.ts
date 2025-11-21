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

    const groupedByColor = useMemo(() => {
        return variants.reduce((acc: Record<string, VariantItem[]>, v) => {
            if (!v.color) return acc;
            if (!acc[v.color]) acc[v.color] = [];
            acc[v.color].push(v);
            return acc;
        }, {});
    }, [variants]);

    const availableSizes = useMemo(() => {
        if (!selectedColor) return [];

        return (groupedByColor[selectedColor] || [])
            .filter(v => v.stock > 0)
            .map(v => v.size || "Free size");
    }, [selectedColor, groupedByColor]);

    const matchedVariant = useMemo(() => {
        return variants.find(v =>
            (selectedColor ? v.color === selectedColor : true) &&
            (selectedSize ? v.size === selectedSize : true)
        ) || null;
    }, [selectedColor, selectedSize, variants]);

    const stock = matchedVariant?.stock ?? 0;

    const price = matchedVariant?.price ?? productPrice ?? 0;


    const availableColors = Object.keys(groupedByColor).filter(color =>
        groupedByColor[color].some(v => v.stock > 0)
    );

    const getImageByColor = (color: string) => {
        const item = groupedByColor[color]?.[0];
        return item?.image ?? null;
    };

    return {

        selectedColor,
        setSelectedColor,
        selectedSize,
        setSelectedSize,


        groupedByColor,
        availableSizes,
        availableColors,
        matchedVariant,

        stock,
        price,

        getImageByColor,
    };
};

