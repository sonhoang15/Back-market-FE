import { useState } from "react";
import img1 from "../../../assets/anh/1.jpeg";
import img2 from "../../../assets/anh/2.jpeg";
import img3 from "../../../assets/anh/3.jpeg";

interface CartItem {
    name: string;
    price: number;
    quantity: number;
}
function ProductDetail() {
    const [quantity, setQuantity] = useState<number>(1);
    const [cart, setCart] = useState<CartItem[]>([]);

    const product = {
        name: "Áo Polo Cổ Đức Regular Cotton 2068",
        price: 349000,
        img: img1,
        thumbnails: [img1, img2, img3],
    };

    const minusQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const plusQuantity = () => {
        setQuantity(quantity + 1);
    };

    const addToCart = () => {
        setCart((prev) => {
            const exists = prev.find((item) => item.name === product.name);
            if (exists) {
                return prev.map((item) =>
                    item.name === product.name
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
        alert("Đã thêm vào giỏ hàng!");
    };

    return (
        <section className="w-full px-10 mt-[60px]">
            {/* Breadcrumb */}
            <div className="flex py-5 text-sm">
                <a href="index.html" className="px-5 text-gray-700">
                    Trang Chủ
                </a>
                <span className="border-l border-black"></span>
                <a href="" className="px-5 text-gray-700">
                    Áo Polo
                </a>
                <span className="border-l border-black"></span>
                <p className="px-5">{product.name}</p>
            </div>

            <div className="flex py-10">
                {/* LEFT */}
                <div className="w-3/4 flex">
                    <div className="w-full pr-5">
                        <img src={product.img} alt={product.name} className="w-full" />
                    </div>
                    <div className="w-1/5 space-y-2 pl-1">
                        {product.thumbnails.map((thumb, index) => (
                            <div key={index} className="border">
                                <img
                                    src={thumb}
                                    alt={`thumb-${index}`}
                                    className="w-full"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT */}
                <div className="w-1/4 pl-5">
                    <div className="border-b border-dotted border-gray-300 pb-2 mb-3">
                        <h1 className="text-lg font-semibold">{product.name}</h1>
                        <p className="text-sm text-green-600">Còn hàng</p>
                    </div>

                    <div className="py-2 text-2xl font-bold text-red-600">
                        {product.price.toLocaleString("vi-VN")}₫
                    </div>

                    {/* Color */}
                    <div className="my-4">
                        <p className="font-medium">Màu sắc</p>
                        <div className="flex space-x-2 mt-2">
                            <button className="w-8 h-8 bg-black border"></button>
                            <button className="w-8 h-8 bg-[rgb(203,184,157)] border"></button>
                            <button className="w-8 h-8 bg-gray-200 border"></button>
                            <button className="w-8 h-8 bg-red-500 border"></button>
                        </div>
                    </div>

                    {/* Size */}
                    <div className="my-4">
                        <p className="font-medium">Size</p>
                        <div className="flex space-x-2 mt-2">
                            {["S", "M", "L", "XL"].map((s) => (
                                <span
                                    key={s}
                                    className="px-4 py-2 border border-gray-300 text-sm cursor-pointer hover:bg-gray-100"
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center my-6">
                        <button
                            onClick={minusQuantity}
                            className="w-10 h-10 border border-gray-300 text-lg"
                        >
                            -
                        </button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            min={1}
                            className="w-16 h-10 border-t border-b border-gray-300 text-center"
                        />
                        <button
                            onClick={plusQuantity}
                            className="w-10 h-10 border border-gray-300 text-lg"
                        >
                            +
                        </button>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-3 mb-6">
                        <button
                            onClick={addToCart}
                            className="w-1/2 py-3 bg-black text-white uppercase text-sm"
                        >
                            Thêm vào giỏ hàng
                        </button>
                        <button className="w-1/2 py-3 bg-black text-white uppercase text-sm">
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
                    <div className="border-b border-gray-200 py-4">
                        <h2 className="font-semibold mb-2">Thuộc tính sản phẩm</h2>
                        <p className="text-sm text-gray-700">
                            ►70% Cotton, 25% Polyester, 5% Spandex
                            <br />►Form Regular rộng thoáng
                            <br />►4 màu: Đen, Trắng, Ghi, Vàng
                            <br />►Cổ Đức thanh lịch
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDetail;
