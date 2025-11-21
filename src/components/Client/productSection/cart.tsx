import React, { useEffect, useState } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
    getCart,
    updateCartItem,
    removeCartItem,
    checkoutCart,
    Cart,
    CartItem,
} from "../../../Services/cartService";
import { useNavigate } from "react-router-dom";

const CartSidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [cart, setCart] = useState<Cart | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchCart();
        }
    }, [isOpen]);

    const fetchCart = async () => {
        try {
            const data = await getCart();
            setCart(data);
        } catch (err) {
            console.error("Error fetching cart:", err);
        }
    };

    const handleIncrease = async (item: CartItem) => {
        try {
            await updateCartItem(item.id, item.quantity + 1);
            await fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDecrease = async (item: CartItem) => {
        if (item.quantity <= 1) return;
        try {
            await updateCartItem(item.id, item.quantity - 1);
            await fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    const handleRemove = async (item: CartItem) => {
        try {
            await removeCartItem(item.id);
            await fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCheckout = () => {
        navigate(`/checkout?cart_id=${cart?.id}`);
        setIsOpen(false);
    };


    const totalQuantity = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const totalPrice = cart?.items?.reduce(
        (sum, item) => sum + parseFloat(item.total_price.toString()),
        0
    ) || 0;


    return (
        <div>
            <div
                onClick={() => setIsOpen(true)}
                className="flex items-center space-x-1 cursor-pointer hover:text-blue-600"
            >
                <ShoppingCart size={18} />
                <span>GIỎ HÀNG ({totalQuantity})</span>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div
                className={`fixed top-0 right-0 h-full w-1/2 md:w-1/3 bg-white shadow-2xl transform transition-transform duration-300 z-50 
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Giỏ hàng</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                        title="Đóng giỏ hàng"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-140px)]">
                    {cart?.items?.length ? (
                        cart.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 border-b pb-3 p-2 rounded relative"
                            >
                                <Link to={`/product/${item.product_id}`} onClick={() => setIsOpen(false)}>
                                    <img
                                        src={item.variant?.image || item.product?.thumbnail || ""}
                                        alt={item.product?.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                </Link>

                                <div className="flex-1">
                                    <h3 className="font-medium">{item.product?.name}</h3>

                                    {item.variant && (
                                        <p className="text-sm text-gray-600">
                                            {item.variant.name} {item.variant.size ? `- Size: ${item.variant.size}` : ""}
                                        </p>
                                    )}

                                    <p className="text-sm text-gray-600">{item.price.toLocaleString()}đ</p>

                                    <div className="flex items-center mt-2 space-x-2">
                                        <button
                                            onClick={() => handleDecrease(item)}
                                            className="p-1 border rounded hover:bg-gray-100"
                                            title="Giảm số lượng"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="px-2">{item.quantity}</span>
                                        <button
                                            onClick={() => handleIncrease(item)}
                                            className="p-1 border rounded hover:bg-gray-100"
                                            title="Tăng số lượng"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end">
                                    <p className="font-semibold">
                                        {item.total_price.toLocaleString()}đ
                                    </p>
                                    <button
                                        onClick={() => handleRemove(item)}
                                        className="text-red-500 hover:text-red-700 mt-2"
                                        title="Xóa khỏi giỏ hàng"
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

                <div className="absolute bottom-0 w-full p-4 border-t bg-white">
                    <div className="flex justify-between font-semibold mb-3">
                        <span>Tổng cộng:</span>
                        <span>{totalPrice.toLocaleString()}đ</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Thanh toán
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartSidebar;
