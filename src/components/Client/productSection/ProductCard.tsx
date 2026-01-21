import { useState, useContext } from "react";
import BuyNowModal from "./buyNow";
import { Link } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";

export interface Product {
    id: number;
    img: string;
    name: string;
    price: number | string;
    thumbnails?: string[];
    description?: string;
    specs?: string;
    status?: string;
    in_stock?: number;
    variants?: Array<{
        color?: string | null;
        size?: string | null;
        image?: string | null;
        stock?: number | null;
        price?: number | string | null;
        images?: number | string[] | null;
    }>;
}


export interface BuyNowModalProduct {
    id: number;
    name: string;
    price: number;
    img: string;
    images: string[];
    thumbnails: string[];
    stock: number;
    colors: string[];
    sizes: string[];
    status: string;
    specs: string;
    description: string;
    variants: Array<{
        color: string;
        size: string;
        stock: number;
        images: string[];
        price?: number;
    }>;
}

interface ProductCardProps {
    product: Product;
}

export function normalizeProduct(data: any): Product {
    const variants = Array.isArray(data.variants) ? data.variants : [];

    const variantImages = variants
        .map((v: any) => v.image)
        .filter((img: string) => !!img);

    const mainImage =
        data.thumbnail ||
        variantImages[0] ||
        "";

    return {
        id: data.id,
        name: data.name,
        img: mainImage,
        price: Number(data.price_min || data.price || variants[0]?.price || 0),
        thumbnails: [
            ...(data.thumbnail ? [data.thumbnail] : []),
            ...variantImages
        ],
        description: data.description || "",
        specs: data.specs || "",
        status: data.status || "active",
        in_stock: data.in_stock || 0,
        variants,
    };
}


export function normalizBestSellerProduct(item: any) {
    const variants = item.variants || [];


    const variantImages = variants
        .map((v: any) => v.image)
        .filter((img: string) => !!img);

    const mainImage =
        item.variant_image ||
        item.thumbnail ||
        variantImages[0] ||
        "";

    return {
        id: item.id,
        name: item.name,
        img: mainImage,
        price: item.price_min || item.price || 0,
        description: item.description || "",
        thumbnails: [
            ...(item.thumbnail ? [item.thumbnail] : []),
            ...variantImages
        ],
        total_sold: Number(item.total_sold) || 0,
        variants,
    };
}

function parsePriceToNumber(input: number | string | undefined): number {
    if (!input) return 0;
    if (typeof input === "number") return input;
    const digits = ("" + input).replace(/[^\d]/g, "");
    return digits ? Number(digits) : 0;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [currentImage, setCurrentImage] = useState(product.img);
    const { user } = useContext(UserContext)!;
    const navigate = useNavigate();
    const uniqueThumbnails = Array.from(
        new Set([product.img, ...(product.thumbnails || [])].filter(Boolean))
    );

    const formattedVariants = (product.variants || []).map((v) => {
        let variantImages: string[] = [];

        if (Array.isArray(v.images)) {
            variantImages = v.images.map((x) => String(x));
        } else if (typeof v.images === "number") {
            variantImages = [`${v.images}`];
        } else if (v.image) {
            variantImages = [String(v.image)];
        }

        return {
            color: v.color || "",
            size: v.size || "",
            stock: Number(v.stock ?? 0),
            images: variantImages,
            price:
                v.price != null
                    ? parsePriceToNumber(v.price)
                    : parsePriceToNumber(product.price),
        };
    });

    const totalStock =
        formattedVariants.length > 0
            ? formattedVariants.reduce((acc, vv) => acc + (vv.stock || 0), 0)
            : Number(product.in_stock ?? 0);

    const colors = Array.from(
        new Set(formattedVariants.map((v) => v.color).filter(Boolean))
    );

    const sizes = Array.from(
        new Set(formattedVariants.map((v) => v.size).filter(Boolean))
    );

    const numericPrice =
        formattedVariants.length > 0
            ? Math.min(...formattedVariants.map((v) => v.price))
            : parsePriceToNumber(product.price);

    const modalProduct: BuyNowModalProduct = {
        id: product.id,
        name: product.name,
        price: numericPrice,
        img: product.img,
        images: uniqueThumbnails,
        thumbnails: uniqueThumbnails,
        stock: totalStock,
        colors,
        sizes,
        status: product.status || "active",
        specs: product.specs || "",
        description: product.description || "",
        variants: formattedVariants,
    };

    const handleDetail = () => {
        if (!user || !user.isAuthenticated) {
            navigate("/auth");
            return;
        }
        navigate(`/product/${product.id}`);
    };

    return (
        <div className="product-item shadow-lg p-4">
            <div className="product-top mb-4">
                <div
                    onClick={handleDetail}
                    className="product-thumb cursor-pointer block overflow-hidden rounded-lg bg-[#f8f9fc]"
                >
                    <div className="w-full h-[500px] flex items-center justify-center">
                        <img
                            src={currentImage}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain transition-transform duration-300 ease-in-out hover:scale-105"
                        />
                    </div>
                </div>
            </div>

            {uniqueThumbnails.length > 0 && (
                <div className="image-min mb-4">
                    <ul className="list-logo flex justify-center gap-2">
                        {uniqueThumbnails.map((thumb, index) => (
                            <li
                                key={index}
                                className={`list-logo-min w-6 h-6 border overflow-hidden cursor-pointer rounded-full ${thumb === currentImage
                                    ? "border-2 border-blue-500"
                                    : "border-gray-300"
                                    }`}
                                onMouseOver={() => setCurrentImage(thumb)}
                                onClick={() => setCurrentImage(thumb)}
                            >
                                <img
                                    src={thumb}
                                    alt={`thumb-${index}`}
                                    className="w-full h-full object-cover"
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="product-infor text-center">
                <a href="#" className="block font-medium text-gray-800 hover:text-gray-400 transition">
                    {product.name}
                </a>
                <span className="text-red-600 font-semibold text-lg block mt-1">
                    {numericPrice.toLocaleString("vi-VN")}đ
                </span>
            </div>

            <div className="mt-2">
                <ul className="flex justify-around border border-black p-[10px] ">
                    <BuyNowModal product={modalProduct} />
                    <li>
                        <button onClick={handleDetail} className="text-black hover:text-gray-400">
                            Chi Tiết
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
