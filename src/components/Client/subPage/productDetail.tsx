import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchVariantsByProduct, getProductById } from "../../../Services/productService";
import { toast } from "react-toastify";
import { addToCart } from "../../../Services/cartService";
import { useProductVariants } from "../useProductVariants";
import { useNavigate } from "react-router-dom";
import { recommendProducts } from "../../../Services/clientSevice";
import { UserContext } from "../../../context/UserContext";


export interface Product {
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
export interface Variant {
    id: number;
    color: string;
    size: string;
    price: number;
    image: string;
    stock: number;
}

function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const [variants, setVariants] = useState<Variant[]>([]);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [quantity, setQuantity] = useState(1);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [loadingRecommend, setLoadingRecommend] = useState(false);
    const { user } = useContext(UserContext)!;
    const navigate = useNavigate();

    const {
        selectedColor,
        setSelectedColor,
        selectedSize,
        setSelectedSize,

        groupedByColor,
        availableSizes,
        matchedVariant,
        stock,
        price,
    } = useProductVariants(variants, product?.price);


    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const [variantsRes, productRes] = await Promise.all([
                    fetchVariantsByProduct(Number(id)),
                    getProductById(Number(id)),
                ]);

                if (variantsRes?.EC === 0 && variantsRes.DT?.length > 0) {
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

                if (productRes?.EC === 0 && productRes.DT) {
                    setProduct(productRes.DT);
                } else {
                    toast.error("Không tìm thấy thông tin sản phẩm");
                }

            } catch (error) {
                console.error(error);
                toast.error("Không thể tải dữ liệu sản phẩm");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (!product) return;

        setLoadingRecommend(true);

        const text = [
            product.name,
            product.category?.name,
            product.description,
        ].filter(Boolean).join(". ");

        recommendProducts({ query: text })
            .then(res => {
                setRecommendations(res.data?.DT || []);
            })
            .catch(() => {
                setRecommendations([]);
            })
            .finally(() => {
                setLoadingRecommend(false);
            });

    }, [product]);

    const totalStock = variants.reduce((total, v: any) => total + v.stock, 0);

    const mainImage =
        (selectedColor && groupedByColor[selectedColor]?.[0]?.image) ||
        product?.img;

    const minusQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const plusQuantity = () => {
        if (quantity < stock) setQuantity(quantity + 1);
    };

    const handleAddToCart = async () => {
        if (!matchedVariant) {
            toast.warn("Vui lòng chọn màu và size hợp lệ");
            return;
        }

        if (quantity > stock) {
            toast.warn(`Chỉ còn ${stock} sản phẩm`);
            return;
        }

        try {
            const res = await addToCart({
                productId: product?.id as number,
                variantId: matchedVariant.id,
                quantity,
            });

            if (res) toast.success("Đã thêm vào giỏ hàng!");
        } catch (err) {
            toast.error("Không thể thêm sản phẩm");
        }
    };

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
        const hasColors = variants.some(v => v.color);
        const hasSizes = variants.some(v => v.size);

        if (hasColors && !selectedColor) {
            toast.error("Vui lòng chọn màu!");
            return;
        }

        if (hasSizes && !selectedSize) {
            toast.error("Vui lòng chọn size!");
            return;
        }

        if (!matchedVariant) {
            toast.error("Không tìm thấy biến thể hợp lệ!");
            return;
        }

        if (quantity > matchedVariant.stock) {
            toast.error(`Chỉ còn ${matchedVariant.stock} sản phẩm`);
            return;
        }

        const variantId = matchedVariant.id;
        const finalPrice = matchedVariant.price ?? product?.price;

        navigate(`/checkout?product_id=${product?.id}`, {
            state: {
                type: "buy-now",
                productId: product?.id,
                variantId,
                quantity,
                price: Number(finalPrice),
            }
        });
    };

    const handleDetail = (productId: number) => {
        navigate(`/product/${productId}`);
    };

    if (loading) {
        return (
            <section className="w-full px-10 mt-[150px]">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin w-12 h-12 border-b-2 border-black rounded-full" />
                </div>
            </section>
        );
    }

    return (
        <section className="w-full px-10 mt-[150px]">

            <div className="flex py-5 text-sm">
                <a href="/home" className="px-5 text-gray-700">Trang Chủ</a>
                <span className="border-l border-black" />
                <a className="px-5 text-gray-700">{product?.category?.name || "Sản phẩm"}</a>
                <span className="border-l border-black" />
                <p className="px-5">{product?.name}</p>
            </div>

            <div className="flex py-10">

                <div className="w-3/4 flex">
                    <div className="w-full pr-5">
                        <img src={mainImage!} className="w-full object-cover" alt={product?.name} />
                    </div>

                    <div className="w-1/5 space-y-2 pl-1">
                        {Object.keys(groupedByColor).map((color) => {
                            const group = groupedByColor[color];
                            const colorStock = group.reduce((s, v) => s + v.stock, 0);
                            const disabled = colorStock <= 0;

                            return (
                                <div key={color} className={`border ${disabled ? "opacity-50" : ""}`}>
                                    <img
                                        src={group[0].image}
                                        alt={`Hình ảnh ${color}`}
                                        className={`w-full cursor-pointer ${selectedColor === color ? "ring-2 ring-black" : ""
                                            } ${disabled ? "cursor-not-allowed" : ""}`}
                                        onClick={() => !disabled && (setSelectedColor(color), setSelectedSize(null))}
                                    />
                                    {disabled && (
                                        <div className="text-xs text-red-500 bg-red-100 text-center py-1">
                                            Hết hàng
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="w-1/4 pl-5">

                    <div className="border-b border-gray-300 pb-2 mb-3">
                        <h1 className="text-lg font-semibold">{product?.name}</h1>
                        <p className={`text-sm ${totalStock > 0 ? "text-green-600" : "text-red-600"}`}>
                            {totalStock > 0 ? "Còn hàng" : "Hết hàng"}
                        </p>
                    </div>

                    <div className="py-2 text-2xl font-bold text-red-600">
                        {Number(price).toLocaleString("vi-VN")}₫
                    </div>

                    <div className="my-4">
                        <p className="font-medium">Màu sắc</p>
                        <div className="flex space-x-2 mt-2">
                            {Object.keys(groupedByColor).map((color) => {
                                const group = groupedByColor[color];
                                const colorStock = group.reduce((s, v) => s + v.stock, 0);
                                const disabled = colorStock <= 0;

                                return (
                                    <button
                                        key={color}
                                        disabled={disabled}
                                        onClick={() => !disabled && (setSelectedColor(color), setSelectedSize(null))}
                                        className={`w-8 h-8 border rounded-full ${selectedColor === color ? "ring-2 ring-black" : ""
                                            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                        style={{
                                            backgroundImage: `url(${group[0].image})`,
                                            backgroundSize: "cover",
                                        }}
                                        title={`Màu ${color}`}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div className="my-4">
                        <p className="font-medium">Size</p>
                        <div className="flex space-x-2 mt-2 flex-wrap gap-2">
                            {availableSizes.length > 0 ? (
                                availableSizes.map((s) => {
                                    const variant = variants.find((v) => v.color === selectedColor && v.size === s);
                                    const disabled = !variant || variant.stock <= 0;

                                    return (
                                        <span
                                            key={s}
                                            onClick={() => !disabled && setSelectedSize(s)}
                                            className={`px-4 py-2 border text-sm cursor-pointer ${selectedSize === s ? "bg-black text-white" : "hover:bg-gray-100"
                                                } ${disabled ? "opacity-50 cursor-not-allowed line-through" : ""}`}
                                        >
                                            {s}
                                        </span>
                                    );
                                })
                            ) : (
                                <span className="text-gray-400">Chọn màu để xem size</span>
                            )}
                        </div>
                    </div>

                    <div className="my-6">
                        <p className="font-medium mb-2">Số lượng</p>

                        <div className="flex items-center">
                            <button onClick={minusQuantity} disabled={quantity <= 1}
                                className="w-10 h-10 border text-lg">-</button>

                            <input
                                type="number"
                                value={quantity}
                                min={1}
                                max={stock}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    if (val >= 1 && val <= stock) setQuantity(val);
                                }}
                                className="w-16 h-10 border-t border-b text-center"
                                title="Số lượng"
                            />

                            <button onClick={plusQuantity} disabled={quantity >= stock}
                                className="w-10 h-10 border text-lg">+</button>
                        </div>

                        {selectedColor && selectedSize && (
                            <p className="text-sm text-gray-500 mt-2">Còn {stock} sản phẩm trong kho</p>
                        )}
                    </div>

                    <div className="flex space-x-3 mb-6">
                        <button
                            onClick={handleAddToCart}
                            disabled={stock <= 0}
                            className={`w-1/2 py-3 uppercase text-sm ${stock > 0 ? "bg-black text-white" : "bg-gray-400 text-gray-200"
                                }`}
                        >
                            {stock > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
                        </button>

                        <button
                            onClick={handleBuyNow}
                            disabled={stock <= 0}
                            className={`w-1/2 py-3 uppercase text-sm ${stock > 0 ? "bg-black text-white" : "bg-gray-400 text-gray-200"
                                }`}
                        >
                            Mua ngay
                        </button>
                    </div>

                    {product?.description && (
                        <div className="border-b border-gray-200 py-4">
                            <h2 className="font-semibold mb-2">Thuộc tính sản phẩm</h2>
                            <p className="text-sm">{formatDescription(product.description)}</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-20 border-t pt-10">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        Có thể bạn sẽ thích
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Các sản phẩm tương tự dựa trên nội dung bạn đang xem
                    </p>
                </div>

                {loadingRecommend ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-[280px] bg-gray-200 animate-pulse"
                            />
                        ))}
                    </div>
                ) : recommendations.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        Chưa có sản phẩm gợi ý phù hợp
                    </p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {recommendations.map((item) => (
                            <div
                                key={item.id}
                                className="border cursor-pointer group hover:shadow-lg transition"
                                onClick={() => handleDetail(item.id)}
                            >
                                <div className="aspect-square bg-gray-100 overflow-hidden">
                                    <img
                                        src={item.image || "/placeholder.png"}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                </div>

                                <div className="p-3">
                                    <h3 className="text-sm font-medium line-clamp-2 min-h-[40px]">
                                        {item.name}
                                    </h3>

                                    {item.price && (
                                        <p className="text-sm font-semibold text-red-600 mt-1">
                                            {Number(item.price).toLocaleString("vi-VN")}₫
                                        </p>
                                    )}

                                    <p className="text-xs text-gray-400 mt-1">
                                        Độ tương đồng: {(item.score * 100).toFixed(0)}%
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default ProductDetail;
