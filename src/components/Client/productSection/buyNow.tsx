import { useState } from "react";
import img1 from "../../../assets/anh/102.jpeg";

const BuyNowModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    // Demo data
    const product = {
        name: "Áo thun nam",
        price: 250000,
        colors: ["Trắng", "Đen", "Xanh"],
        sizes: ["S", "M", "L", "XL"],
        image: img1
    };

    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [quantity, setQuantity] = useState(1);

    const totalPrice = product.price * quantity;

    return (
        <div>
            <button
                onClick={() => setIsOpen(true)}
                className="text-black pr-[70px] mr-[-30px] border-r border-black hover:text-gray-400"
            >
                Mua ngay
            </button>

            {/* Modal chọn mua */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white w-96 rounded-2xl shadow-xl p-6 relative">
                        <div className="flex justify-center mb-4">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-40 h-40 object-cover rounded-lg shadow-md"
                            />
                        </div>
                        <h3 className="text-xl font-bold mb-4">{product.name}</h3>

                        {/* Chọn màu */}
                        <div className="mb-3">
                            <label className="font-semibold">Màu sắc:</label>
                            <div className="flex gap-2 mt-2">
                                {product.colors.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setSelectedColor(c)}
                                        className={`px-3 py-1 rounded-lg border ${selectedColor === c
                                            ? "bg-blue-600 text-white"
                                            : "hover:bg-gray-100"
                                            }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chọn size */}
                        <div className="mb-3">
                            <label className="font-semibold">Kích thước:</label>
                            <div className="flex gap-2 mt-2">
                                {product.sizes.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setSelectedSize(s)}
                                        className={`px-3 py-1 rounded-lg border ${selectedSize === s
                                            ? "bg-blue-600 text-white"
                                            : "hover:bg-gray-100"
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Số lượng */}
                        <div className="mb-3">
                            <label className="font-semibold">Số lượng:</label>
                            <div className="flex items-center gap-3 mt-2">
                                <button
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="px-3 py-1 border rounded-lg hover:bg-gray-100"
                                >
                                    -
                                </button>
                                <span className="text-lg font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity((q) => q + 1)}
                                    className="px-3 py-1 border rounded-lg hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Giá */}
                        <p className="text-lg font-bold mt-3">
                            Tổng: {totalPrice.toLocaleString()}đ
                        </p>

                        {/* Action */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setConfirmOpen(true);
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Mua ngay
                            </button>
                        </div>

                        {/* Nút đóng góc */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Modal xác nhận */}
            {confirmOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                    <div className="bg-white w-96 rounded-2xl shadow-xl p-6 text-center relative">
                        <h3 className="text-xl font-bold mb-4">Xác nhận mua hàng</h3>
                        <p className="mb-4">
                            Bạn đã chọn{" "}
                            <span className="font-semibold">{quantity}</span> x{" "}
                            {product.name} ({selectedColor}, {selectedSize})
                        </p>
                        <p className="text-lg font-bold text-green-600 mb-6">
                            Tổng thanh toán: {totalPrice.toLocaleString()}đ
                        </p>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setConfirmOpen(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={() => {
                                    // Gọi API đặt hàng ở đây
                                    setConfirmOpen(false);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Xác nhận
                            </button>
                        </div>

                        {/* Nút đóng góc */}
                        <button
                            onClick={() => setConfirmOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuyNowModal;
