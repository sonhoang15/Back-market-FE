import axios from "../setup/axios";


interface AddToCartParams {
    productId: number;
    variantId?: number | null;
    quantity: number;
}

// Kiểu cho CartItem
export interface CartItem {
    id: number;
    cart_id: number;
    product_id: number;
    variant_id?: number | null;
    quantity: number;
    price: number;
    total_price: number;
    product?: { name: string;[key: string]: any };
    variant?: { name: string;[key: string]: any };
}

// Kiểu cho Cart
export interface Cart {
    id: number;
    user_id: number;
    total_quantity: number | null;
    total_price: number | null;
    status: string;
    items: CartItem[];
}


// Lấy giỏ hàng hiện tại
const getCart = async (): Promise<Cart> => {
    const res = await axios.get("/api/v1/cart/read");
    return res;
};

// Thêm sản phẩm vào giỏ
const addToCart = ({ productId, variantId, quantity }: AddToCartParams): Promise<any> => {
    return axios.post("/api/v1/cart/add-item", { productId, variantId, quantity });
};

// Cập nhật số lượng sản phẩm
const updateCartItem = async (
    itemId: number,
    quantity: number
): Promise<{ cart: Cart; item: CartItem }> => {
    const res = await axios.put(`/api/v1/cart/update/${itemId}`, { quantity });
    return res;
};

// Xóa sản phẩm khỏi giỏ
const removeCartItem = async (itemId: number): Promise<{ cart: Cart }> => {
    const res = await axios.delete(`/api/v1/cart/delete/${itemId}`);
    return res;
};

// Checkout giỏ hàng
const checkoutCart = async (): Promise<{ order: any }> => {
    const res = await axios.post("/api/v1/cart/checkout");
    return res;
};

const clearCart = async (cartId: number) => {
    const res = await axios.delete(`/api/v1/cart/clear/${cartId}`);
    return res.data;
};

export { getCart, addToCart, updateCartItem, removeCartItem, checkoutCart, clearCart };
