import React, { useEffect, useMemo, useState } from "react";
import { useProductVariants, VariantItem } from "../useProductVariants";
import { getProductById } from "../../../Services/productService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export interface BuyNowProductVariant {
    id?: number;
    color?: string;
    size?: string;
    image?: string;
    price?: number | string;
    stock?: number;
}
export interface BuyNowProduct {
    id: number;
    name: string;
    price: number;
    img: string;
    images: string[];
    thumbnails?: string[];
    colors: string[];
    sizes: string[];
    stock: number;
    status?: string;
    description?: string;
    specs?: string;
    variants?: BuyNowProductVariant[];
}

interface BuyNowModalProps {
    // allow either a full product or a minimal product from the card
    product: Partial<BuyNowProduct> & { id: number };
}

const BuyNowModal: React.FC<BuyNowModalProps> = ({ product: initialProduct }) => {
    const [isOpen, setIsOpen] = useState(false);

    // local product state that we actually use in modal
    const [product, setProduct] = useState<BuyNowProduct | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const navigate = useNavigate();

    // When modal opened, ensure we have full detail (variants, description).
    useEffect(() => {
        if (!isOpen) return;

        const ensureDetail = async () => {
            // quick merge from initialProduct if it already has good data
            const hasVariants = Array.isArray(initialProduct.variants) && initialProduct.variants.length > 0;
            const hasDescription = typeof initialProduct.description === "string" && initialProduct.description.trim() !== "";

            if (hasVariants && hasDescription) {
                // we can use initialProduct but normalize fields
                const normalized = normalizeToBuyNowProduct(initialProduct as any);
                setProduct(normalized);
                return;
            }

            // otherwise fetch full detail from API
            try {
                setLoadingDetail(true);
                const res = await getProductById(initialProduct.id);
                // getProductById expected shape: { EC, EM, DT }
                if (res?.EC === 0 && res.DT) {
                    const detail = mapApiDetailToBuyNow(res.DT);
                    setProduct(detail);
                } else {
                    // fallback to initial (with best effort)
                    setProduct(normalizeToBuyNowProduct(initialProduct as any));
                }
            } catch (err) {
                console.error("Failed to fetch product detail for modal", err);
                setProduct(normalizeToBuyNowProduct(initialProduct as any));
            } finally {
                setLoadingDetail(false);
            }
        };

        ensureDetail();
    }, [isOpen, initialProduct]);

    // normalize helpers
    function parsePriceToNumber(input: any) {
        if (input == null) return 0;
        if (typeof input === "number") return input;
        const digits = String(input).replace(/[^\d]/g, "");
        return digits ? Number(digits) : 0;
    }

    function normalizeVariants(srcVariants: any[] = []) {
        return srcVariants.map(v => ({
            id: v.id,
            color: v.color ?? "",
            size: v.size ?? "",
            stock: Number(v.stock ?? 0),
            image: v.image ?? null,
            price: parsePriceToNumber(v.price ?? v.price_min ?? v.price_max),
            images: v.images && Array.isArray(v.images) ? v.images : (v.image ? [v.image] : []),
        }));
    }

    function normalizeToBuyNowProduct(src: any): BuyNowProduct {
        const variants = normalizeVariants(src.variants || []);
        const images = Array.from(new Set([src.img ?? src.thumbnail ?? "", ...(src.thumbnails || []), ...variants.flatMap(v => v.images || [])])).filter(Boolean);
        const colors = Array.from(new Set(variants.map(v => v.color).filter(Boolean)));
        const sizes = Array.from(new Set(variants.map(v => v.size).filter(Boolean)));
        const stock = variants.length > 0 ? variants.reduce((s, v) => s + (v.stock || 0), 0) : Number(src.totalStock ?? src.in_stock ?? 0);

        return {
            id: src.id,
            name: src.name,
            price: parsePriceToNumber(src.price ?? src.price_min ?? src.price_max),
            img: src.img ?? src.thumbnail ?? images[0] ?? "",
            images,
            thumbnails: src.thumbnails ?? images,
            colors,
            sizes,
            stock,
            status: src.status ?? "active",
            description: src.description ?? "",
            specs: src.specs ?? "",
            variants: variants.map(v => ({
                id: v.id,
                color: v.color,
                size: v.size,
                stock: v.stock,
                images: v.images,
                price: v.price,
                image: v.image
            })),
        };
    }

    function mapApiDetailToBuyNow(apiDT: any): BuyNowProduct {
        // apiDT likely has: id, name, description, thumbnail, variants([...])
        return normalizeToBuyNowProduct(apiDT);
    }

    // useProductVariants hook expects VariantItem[] with fields color,size,image,price,stock
    const normalizedVariantsForHook: VariantItem[] = useMemo(() => {
        if (!product?.variants) return [];
        return product.variants.map(v => ({
            id: (v as any).id,
            color: v.color ?? null,
            size: v.size ?? null,
            image: (v as any).images?.[0] ?? (v as any).image ?? null,
            price: v.price ?? product.price,
            stock: v.stock ?? 0,
        }));
    }, [product]);

    const {
        selectedColor,
        setSelectedColor,
        selectedSize,
        setSelectedSize,
        availableSizes,
        matchedVariant,
        stock,
        price,
    } = useProductVariants(normalizedVariantsForHook, product?.price);

    // selected image logic
    const [selectedImage, setSelectedImage] = useState<string | undefined>(product?.img);

    useEffect(() => {
        if (product) setSelectedImage(product.img);
    }, [product?.img]);

    useEffect(() => {
        if (matchedVariant?.image) setSelectedImage(matchedVariant.image as string);
    }, [matchedVariant]);

    const [quantity, setQuantity] = useState(1);
    const totalPrice = Number(price) * quantity;

    const formatDescription = (description: string) => {
        const lines = description.split("►");
        return lines.map((line, i) => (
            <span key={i}>
                {i > 0 && "►"}
                {line.trim()}
                <br />
            </span>
        ));
    };

    const handleBuyNow = () => {
        const hasColors = Array.isArray(product?.colors) && product.colors.length > 0;
        const hasSizes = Array.isArray(product?.sizes) && product.sizes.length > 0;

        if (hasColors && !selectedColor) {
            toast.error("Vui lòng chọn màu!");
            return;
        }

        if (hasSizes && !selectedSize) {
            toast.error("Vui lòng chọn size!");
            return;
        }

        // Với sản phẩm không có size/color → matchedVariant có thể null
        const variantId = matchedVariant?.id ?? null;
        const finalPrice = matchedVariant?.price ?? product?.price;

        navigate(`/checkout?product_id=${product?.id}`, {
            state: {
                type: "buy-now",
                productId: product?.id,
                variantId,
                quantity,
                price: Number(finalPrice),
            }
        });

        setIsOpen(false);
    };


    return (
        <div>
            <button onClick={() => setIsOpen(true)} className="text-black pr-[50px] mr-[-30px] border-r border-black hover:text-gray-400 transition-colors duration-200">
                Mua ngay
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
                    <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
                        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors duration-200">✕</button>

                        {loadingDetail || !product ? (
                            <div className="p-8 text-center">Đang tải...</div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                {/* LEFT: images */}
                                <div className="bg-gray-50 p-6">
                                    <div className="flex flex-col lg:flex-row gap-4">
                                        {product.images.length > 1 && (
                                            <div className="flex lg:flex-col gap-2 order-2 lg:order-1 overflow-x-auto lg:overflow-x-visible">
                                                {product.images.map((img, idx) => (
                                                    <img key={idx} src={img} onClick={() => setSelectedImage(img)} className={`w-16 h-16 object-cover border cursor-pointer hover:opacity-80 ${selectedImage === img ? "border-2 border-black" : "border-gray-300"}`} alt="" />
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex-1 order-1 lg:order-2">
                                            <img src={selectedImage} className="w-full h-auto max-h-[400px] object-cover" alt={product.name} />
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT: info */}
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                                    <p className="text-sm text-gray-600 mb-4">Tình trạng: <span className="font-semibold text-green-600">{product.status}</span></p>

                                    <div className="mb-6">
                                        <p className="text-2xl font-bold text-gray-900">{Number(price).toLocaleString("vi-VN")}đ</p>
                                    </div>

                                    <div className="mb-4">
                                        <p className={`text-sm font-medium ${stock > 0 ? "text-green-600" : "text-red-600"}`}>{stock > 0 ? `Còn ${stock} sản phẩm` : "Hết hàng"}</p>
                                    </div>

                                    {product.colors?.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="font-semibold mb-3">MÀU SẮC</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {product.colors.map((color, i) => {
                                                    const enabled = normalizedVariantsForHook.some(v => v.color === color && (!selectedSize || v.size === selectedSize) && v.stock > 0);
                                                    return (
                                                        <button key={i} onClick={() => enabled && setSelectedColor(color)} className={`px-4 py-2 border text-sm min-w-[60px] ${selectedColor === color ? "bg-black text-white border-black" : "border-gray-300 hover:border-gray-600"} ${!enabled && "opacity-40 cursor-not-allowed"}`}>{color}</button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {product.sizes?.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="font-semibold mb-3">KÍCH THƯỚC</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {product.sizes.map((size, i) => {
                                                    const enabled = availableSizes.includes(size);
                                                    return (
                                                        <button key={i} onClick={() => enabled && setSelectedSize(size)} className={`px-4 py-2 border text-sm min-w-[60px] ${selectedSize === size ? "bg-black text-white border-black" : "border-gray-300 hover:border-gray-600"} ${!enabled && "opacity-40 cursor-not-allowed"}`}>{size}</button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* quantity / buy button */}
                                    <div className="mb-6">
                                        <h4 className="font-semibold mb-3">Số lượng</h4>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 border border-gray-300 flex items-center justify-center" disabled={quantity <= 1}>–</button>
                                            <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                                            <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 border border-gray-300 flex items-center justify-center" disabled={quantity >= stock}>+</button>
                                        </div>
                                    </div>

                                    <button onClick={handleBuyNow} className={`w-full py-4 text-lg font-semibold ${stock > 0 ? "bg-black text-white hover:bg-gray-800" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`} disabled={stock === 0}>{stock > 0 ? `SỞ HỮU NGAY - ${totalPrice.toLocaleString("vi-VN")}đ` : "HẾT HÀNG"}</button>

                                    <div className="space-y-4 border-t pt-4">
                                        <details className="group"><summary className="flex justify-between items-center cursor-pointer list-none font-semibold text-gray-900 py-2"><span>MÔ TẢ SẢN PHẨM</span><span className="transition-transform duration-200 group-open:rotate-180">▼</span></summary><div className="mt-2 text-gray-600 text-sm">{formatDescription(product.description ?? "") || "Đang cập nhật"}</div></details>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuyNowModal;
