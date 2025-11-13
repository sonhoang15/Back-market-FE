import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchVariantsByProduct, getProductById } from "../../../Services/productService";
import { toast } from "react-toastify";

// Thêm interface cho Product
interface Product {
    id: number;
    name: string;
    price: string | number;
    description: string;
    img: string;
    thumbnails: string[];
    category?: {
        id: number;
        name: string;
    };
}

interface Variant {
    id: number;
    color: string | null;
    size: string | null;
    price: string | number | null;
    image: string | null;
    stock: number;
}

interface CartItem {
    name: string;
    price: number;
    quantity: number;
    color?: string;
    size?: string;
}

function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const [variants, setVariants] = useState<Variant[]>([]);
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            try {
                setLoading(true);

                // Gọi 2 API cùng lúc
                const [variantsRes, productRes] = await Promise.all([
                    fetchVariantsByProduct(Number(id)),
                    fetchProductById(Number(id))
                ]);

                // Xử lý variants
                if (variantsRes && variantsRes.EC === 0 && Array.isArray(variantsRes.DT) && variantsRes.DT.length > 0) {
                    const cleaned = variantsRes.DT.map((v: any) => ({
                        id: v.id,
                        color: v.color ?? "Không xác định",
                        size: v.size ?? "Free size",
                        price: v.price ?? 0,
                        image: v.image ?? "/placeholder.png",
                        stock: v.stock ?? 0,
                    }));
                    setVariants(cleaned);
                    setSelectedColor(cleaned[0].color);
                } else {
                    toast.error("Không tìm thấy biến thể sản phẩm");
                }

                // Xử lý product details
                if (productRes && productRes.EC === 0 && productRes.DT) {
                    setProduct(productRes.DT);
                } else {
                    toast.error("Không tìm thấy thông tin sản phẩm");
                }

            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
                toast.error("Không thể tải dữ liệu sản phẩm");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const fetchProductById = async (productId: number): Promise<any> => {
        try {
            const response = await getProductById(productId);
            return response;
        } catch (error) {
            console.error("Error fetching product:", error);
            return { EC: 1, EM: "Lỗi khi lấy thông tin sản phẩm", DT: null };
        }
    };

    // Tính tổng stock từ tất cả các variant
    const totalStock = variants.reduce((total, variant) => total + (variant.stock || 0), 0);

    // Kiểm tra stock của biến thể được chọn
    const getSelectedVariantStock = (): number => {
        if (!selectedColor || !selectedSize) return 0;

        const selectedVariant = variants.find(
            v => v.color === selectedColor && v.size === selectedSize
        );

        return selectedVariant ? selectedVariant.stock : 0;
    };

    // Kiểm tra xem biến thể được chọn có còn hàng không
    const isSelectedVariantInStock = (): boolean => {
        return getSelectedVariantStock() > 0;
    };

    // Lấy danh sách size có hàng cho màu đã chọn
    const getAvailableSizes = (): string[] => {
        if (!selectedColor) return [];

        const availableSizes = variants
            .filter(v => v.color === selectedColor && v.stock > 0)
            .map(v => v.size || "Free size");

        return [...new Set(availableSizes)];
    };

    // SỬA LẠI PHẦN TÍNH PRICE ĐỂ TRÁNH LỖI TYPE
    const getCurrentPrice = (): string | number => {
        // Nếu có selectedColor và selectedSize
        if (selectedColor && selectedSize) {
            const colorGroup = groupedByColor[selectedColor];
            if (colorGroup) {
                const variant = colorGroup.find(v => v.size === selectedSize);
                return variant?.price || product?.price || 0;
            }
        }

        // Nếu chỉ có selectedColor
        if (selectedColor) {
            const colorGroup = groupedByColor[selectedColor];
            if (colorGroup && colorGroup.length > 0) {
                return colorGroup[0]?.price || product?.price || 0;
            }
        }

        // Fallback về product price
        return product?.price || 0;
    };

    const minusQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const plusQuantity = () => {
        const selectedStock = getSelectedVariantStock();
        if (selectedStock > 0 && quantity < selectedStock) {
            setQuantity(quantity + 1);
        }
    };

    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) {
            toast.warn("Vui lòng chọn màu và size");
            return;
        }

        const selectedVariantStock = getSelectedVariantStock();
        if (selectedVariantStock <= 0) {
            toast.warn("Biến thể này đã hết hàng");
            return;
        }

        if (quantity > selectedVariantStock) {
            toast.warn(`Chỉ còn ${selectedVariantStock} sản phẩm trong kho`);
            return;
        }

        const variant = variants.find(
            (v) => v.color === selectedColor && v.size === selectedSize
        );

        setCart((prev) => {
            const nameKey = `${selectedColor} - ${selectedSize}`;
            const exists = prev.find((item) => item.name === nameKey);
            if (exists) {
                return prev.map((item) =>
                    item.name === nameKey
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [
                ...prev,
                {
                    name: nameKey,
                    price: Number(variant?.price) || 0,
                    quantity,
                    color: selectedColor,
                    size: selectedSize,
                },
            ];
        });
        toast.success("Đã thêm vào giỏ hàng!");
    };

    const formatDescription = (description: string) => {
        const lines = description.split('►');

        if (lines.length > 1) {
            return lines.map((line, index) => {
                if (index === 0) {
                    return line.trim() ? (
                        <span key={index}>
                            {line.trim()}
                            <br />
                        </span>
                    ) : null;
                } else {
                    return (
                        <span key={index}>
                            ►{line.trim()}
                            <br />
                        </span>
                    );
                }
            });
        } else {
            return description;
        }
    };

    const groupedByColor = variants.reduce((acc, v) => {
        if (!v.color) return acc;
        if (!acc[v.color]) acc[v.color] = [];
        acc[v.color].push(v);
        return acc;
    }, {} as Record<string, Variant[]>);

    const mainImage = (selectedColor && groupedByColor[selectedColor]?.[0]?.image) || product?.img;

    const availableSizes = getAvailableSizes();

    // SỬ DỤNG HÀM getCurrentPrice THAY VÌ BIỂU THỨC PHỨC TẠP
    const price = getCurrentPrice();

    if (loading) {
        return (
            <section className="w-full px-10 mt-[150px]">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full px-10 mt-[150px]">
            {/* Breadcrumb */}
            <div className="flex py-5 text-sm">
                <a href="/home" className="px-5 text-gray-700">
                    Trang Chủ
                </a>
                <span className="border-l border-black"></span>
                <a href="#" className="px-5 text-gray-700">
                    {product?.category?.name || "Sản phẩm"}
                </a>
                <span className="border-l border-black"></span>
                <p className="px-5">{product?.name || selectedColor || "Đang tải..."}</p>
            </div>

            <div className="flex py-10">
                {/* LEFT */}
                <div className="w-3/4 flex">
                    <div className="w-full pr-5">
                        {mainImage ? (
                            <img src={mainImage} alt="product" className="w-full object-cover" />
                        ) : (
                            <div className="w-full h-[400px] bg-gray-200 animate-pulse" />
                        )}
                    </div>
                    <div className="w-1/5 space-y-2 pl-1">
                        {Object.keys(groupedByColor).map((color, index) => {
                            const colorVariants = groupedByColor[color];
                            const colorStock = colorVariants.reduce((sum, v) => sum + v.stock, 0);
                            const isColorOutOfStock = colorStock <= 0;

                            return (
                                <div
                                    key={index}
                                    className={`border ${isColorOutOfStock ? 'opacity-50' : ''}`}
                                    title={isColorOutOfStock ? "Màu này đã hết hàng" : ""}
                                >
                                    <img
                                        src={colorVariants[0].image || "/placeholder.png"}
                                        alt={color}
                                        className={`w-full cursor-pointer ${selectedColor === color
                                            ? "ring-2 ring-black"
                                            : ""
                                            } ${isColorOutOfStock ? 'cursor-not-allowed' : ''}`}
                                        onClick={() => {
                                            if (!isColorOutOfStock) {
                                                setSelectedColor(color);
                                                setSelectedSize(null);
                                            }
                                        }}
                                    />
                                    {isColorOutOfStock && (
                                        <div className="text-xs text-center text-red-500 bg-red-100 py-1">
                                            Hết hàng
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT */}
                <div className="w-1/4 pl-5">
                    <div className="border-b border-dotted border-gray-300 pb-2 mb-3">
                        <h1 className="text-lg font-semibold">{product?.name || `Sản phẩm #${id}`}</h1>
                        <p className={`text-sm ${totalStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {totalStock > 0 ? "Còn hàng" : "Hết hàng"}
                        </p>
                        {selectedColor && selectedSize && !isSelectedVariantInStock() && (
                            <p className="text-sm text-red-500 mt-1">
                                Biến thể này đã hết hàng
                            </p>
                        )}
                    </div>

                    <div className="py-2 text-2xl font-bold text-red-600">
                        {/* SỬ DỤNG price ĐÃ ĐƯỢC TÍNH TOÁN AN TOÀN */}
                        {price ? Number(price).toLocaleString("vi-VN") + "₫" : "Đang tải..."}
                    </div>

                    {/* Color */}
                    <div className="my-4">
                        <p className="font-medium">Màu sắc</p>
                        <div className="flex space-x-2 mt-2">
                            {Object.keys(groupedByColor).map((color) => {
                                const colorVariants = groupedByColor[color];
                                const colorStock = colorVariants.reduce((sum, v) => sum + v.stock, 0);
                                const isColorOutOfStock = colorStock <= 0;

                                return (
                                    <button
                                        key={color}
                                        onClick={() => {
                                            if (!isColorOutOfStock) {
                                                setSelectedColor(color);
                                                setSelectedSize(null);
                                            }
                                        }}
                                        disabled={isColorOutOfStock}
                                        className={`w-8 h-8 border rounded-full ${selectedColor === color
                                            ? "ring-2 ring-black"
                                            : ""
                                            } ${isColorOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        style={{
                                            backgroundImage: `url(${groupedByColor[color][0].image || "/placeholder.png"})`,
                                            backgroundSize: "cover",
                                        }}
                                        title={isColorOutOfStock ? "Màu này đã hết hàng" : color}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* Size */}
                    <div className="my-4">
                        <p className="font-medium">Size</p>
                        <div className="flex space-x-2 mt-2 flex-wrap gap-2">
                            {availableSizes.length > 0 ? (
                                availableSizes.map((s) => {
                                    const sizeVariant = variants.find(
                                        v => v.color === selectedColor && v.size === s
                                    );
                                    const isSizeOutOfStock = !sizeVariant || sizeVariant.stock <= 0;

                                    return (
                                        <span
                                            key={s}
                                            onClick={() => {
                                                if (!isSizeOutOfStock) {
                                                    setSelectedSize(s);
                                                }
                                            }}
                                            className={`px-4 py-2 border text-sm cursor-pointer ${selectedSize === s
                                                ? "bg-black text-white"
                                                : "hover:bg-gray-100"
                                                } ${isSizeOutOfStock ? 'opacity-50 cursor-not-allowed line-through' : ''}`}
                                            title={isSizeOutOfStock ? "Size này đã hết hàng" : ""}
                                        >
                                            {s}
                                            {isSizeOutOfStock && " (Hết)"}
                                        </span>
                                    );
                                })
                            ) : (
                                <span className="text-gray-400">Chọn màu để xem size</span>
                            )}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="my-6">
                        <p className="font-medium mb-2">Số lượng</p>
                        <div className="flex items-center">
                            <button
                                onClick={minusQuantity}
                                disabled={quantity <= 1}
                                className="w-10 h-10 border border-gray-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                -
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => {
                                    const newQuantity = Number(e.target.value);
                                    const maxQuantity = getSelectedVariantStock();
                                    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
                                        setQuantity(newQuantity);
                                    }
                                }}
                                min={1}
                                max={getSelectedVariantStock()}
                                className="w-16 h-10 border-t border-b border-gray-300 text-center"
                            />
                            <button
                                onClick={plusQuantity}
                                disabled={quantity >= getSelectedVariantStock()}
                                className="w-10 h-10 border border-gray-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                +
                            </button>
                        </div>
                        {selectedColor && selectedSize && (
                            <p className="text-sm text-gray-500 mt-2">
                                Còn {getSelectedVariantStock()} sản phẩm trong kho
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-3 mb-6">
                        <button
                            onClick={handleAddToCart}
                            disabled={!isSelectedVariantInStock() || totalStock <= 0}
                            className={`w-1/2 py-3 uppercase text-sm ${isSelectedVariantInStock() && totalStock > 0
                                ? 'bg-black text-white hover:bg-gray-800'
                                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                }`}
                        >
                            {isSelectedVariantInStock() ? "Thêm vào giỏ hàng" : "Hết hàng"}
                        </button>
                        <button
                            disabled={!isSelectedVariantInStock() || totalStock <= 0}
                            className={`w-1/2 py-3 uppercase text-sm ${isSelectedVariantInStock() && totalStock > 0
                                ? 'bg-black text-white hover:bg-gray-800'
                                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                }`}
                        >
                            Mua ngay
                        </button>
                    </div>

                    {/* Share */}
                    <div className="text-center text-xs font-bold uppercase">
                        <span className="block mb-2 font-normal">Chia sẻ</span>
                        <div className="flex justify-center space-x-3">
                            <a
                                href="https://www.facebook.com/krik.vn"
                                className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white"
                            >
                                f
                            </a>
                            <a className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
                                T
                            </a>
                            <a className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
                                G+
                            </a>
                        </div>
                    </div>

                    {/* Description */}
                    {product?.description && (
                        <div className="border-b border-gray-200 py-4">
                            <h2 className="font-semibold mb-2">Thuộc tính sản phẩm</h2>
                            <p className="text-sm text-gray-700">
                                {formatDescription(product.description)}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default ProductDetail;