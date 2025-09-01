import React, { useState } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const CartSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Demo sản phẩm trong giỏ hàng
    const [cartItems, setCartItems] = useState([
        { id: 1, name: "Áo thun nam", price: 200000, quantity: 2, image: "https://via.placeholder.com/60" },
        { id: 2, name: "Quần jeans nữ", price: 350000, quantity: 1, image: "https://via.placeholder.com/60" },
    ]);

    //  Hàm tăng số lượng
    const increaseQuantity = (id: number) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    //  Hàm giảm số lượng
    const decreaseQuantity = (id: number) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    //  Xóa sản phẩm
    const removeItem = (id: number) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    // Tổng số sản phẩm
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // Tổng tiền
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div>
            {/* Nút mở giỏ hàng */}
            <div
                onClick={() => setIsOpen(true)}
                className="flex items-center space-x-1 cursor-pointer hover:text-blue-600"
            >
                <ShoppingCart size={18} />
                <span>GIỎ HÀNG ({totalQuantity})</span>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar giỏ hàng */}
            <div
                className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Giỏ hàng</h2>
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-140px)]">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 border-b pb-3 p-2 rounded relative"
                            >
                                {/* Ảnh */}
                                <Link
                                    to={`/product/${item.id}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                </Link>

                                {/* Thông tin */}
                                <div className="flex-1">
                                    <h3 className="font-medium">{item.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        {item.price.toLocaleString()}đ
                                    </p>

                                    {/* Nút tăng giảm số lượng */}
                                    <div className="flex items-center mt-2 space-x-2">
                                        <button
                                            onClick={() => decreaseQuantity(item.id)}
                                            className="p-1 border rounded hover:bg-gray-100"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="px-2">{item.quantity}</span>
                                        <button
                                            onClick={() => increaseQuantity(item.id)}
                                            className="p-1 border rounded hover:bg-gray-100"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Tổng giá */}
                                <div className="flex flex-col items-end">
                                    <p className="font-semibold">
                                        {(item.price * item.quantity).toLocaleString()}đ
                                    </p>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-500 hover:text-red-700 mt-2"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">Giỏ hàng trống</p>
                    )}
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 w-full p-4 border-t bg-white">
                    <div className="flex justify-between font-semibold mb-3">
                        <span>Tổng cộng:</span>
                        <span>{totalPrice.toLocaleString()}đ</span>
                    </div>
                    <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Thanh toán
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartSidebar;
