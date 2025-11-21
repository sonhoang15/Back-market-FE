import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { getProfile, sendOrderEmail, saveOrder } from "../../../Services/clientSevice";
import { getCart } from "../../../Services/cartService";
import { getProductById } from "../../../Services/productService";
import { clearCart } from "../../../Services/cartService";
import { useNavigate } from "react-router-dom";

export default function CheckoutForm() {
    const [form, setForm] = useState({
        username: "",
        phone: "",
        email: "",
        address: "",
        province: "",
        district: "",
        ward: "",
        note: "",
        payment: "COD",
    });

    const [items, setItems] = useState<any[]>([]);
    const [total, setTotal] = useState(0);

    // Lấy query param
    const location = useLocation();
    const query = new URLSearchParams(location.search);

    const cartIdParam = query.get("cart_id");
    const cartId = cartIdParam ? Number(cartIdParam) : null;
    const productId = query.get("product_id");
    const quantity = Number(query.get("quantity")) || 1;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // ⬇️ Fetch profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getProfile();
                if (res.data.EC === 0 && res.data.DT) {
                    const p = res.data.DT;
                    setForm((prev) => ({
                        ...prev,
                        username: p.username || "",
                        phone: p.phone || "",
                        email: p.email || "",
                        address: p.address || "",
                        province: p.province || "",
                        district: p.district || "",
                        ward: p.ward || "",
                    }));
                } else {
                    toast.warning("Không thể lấy thông tin người dùng");
                }
            } catch {
                toast.error("Lỗi kết nối server");
            }
        };
        fetchProfile();
    }, []);

    // ⬇️ Fetch sản phẩm giỏ hàng hoặc Buy Now
    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                // CASE 1 — Checkout từ giỏ hàng
                if (cartId) {
                    const res: any = await getCart();

                    console.log("getCart RAW:", res);

                    const cart = res;  // FIX CHUẨN TỪ LOG

                    if (!cart || !cart.items) {
                        toast.error("Không tìm thấy giỏ hàng");
                        return;
                    }

                    setItems(cart.items.map((item: any) => ({
                        cart_item_id: item.id,
                        product_id: item.product_id,
                        variant_id: item.variant_id,
                        name: item.product?.name,
                        price: item.price,
                        quantity: item.quantity,
                        color: item.variant?.color,
                        size: item.variant?.size,
                        image: item.variant?.image,
                    })));

                    setTotal(Number(cart.total_price) || 0);
                    return;
                }
                // CASE 2 — Buy Now
                if (productId) {
                    const res: any = await getProductById(Number(productId));

                    const p = res.data?.DT ?? res.DT;

                    if (!p) {
                        toast.error("Không tìm thấy sản phẩm");
                        return;
                    }

                    const variant = p.variants?.[0];
                    const price = variant?.price || 0;

                    setItems([
                        {
                            product_id: p.id,
                            variant_id: variant.id,
                            name: p.name,
                            price,
                            quantity,
                            color: variant?.color,
                            size: variant?.size,
                            image: variant?.image,
                        },
                    ]);

                    setTotal(price * quantity);
                }
            } catch (err) {
                if (cartId) {
                    toast.error("Không thể tải dữ liệu giỏ hàng");
                } else {
                    toast.error("Không thể tải thông tin sản phẩm");
                }
            }
        };

        fetchOrderData();
    }, [cartId, productId, quantity]);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCheckout = async () => {
        const requiredFields: { key: keyof typeof form; label: string }[] = [
            { key: "username", label: "Họ và tên" },
            { key: "phone", label: "Số điện thoại" },
            { key: "email", label: "Email" },
            { key: "address", label: "Địa chỉ" },
            { key: "province", label: "Tỉnh / Thành phố" },
            { key: "district", label: "Quận / Huyện" },
            { key: "ward", label: "Phường / Xã" },
        ];

        for (let field of requiredFields) {
            if (!form[field.key] || form[field.key].trim() === "") {
                toast.error(`Vui lòng nhập ${field.label}`);
                return;
            }
        }
        try {
            setLoading(true); // 🔥 BẬT LOADING
            const isBuyNow = location.state?.type === "buy-now";

            const queryParams = new URLSearchParams(location.search);
            const cartId = queryParams.get("cart_id");

            const buyNowItem = isBuyNow
                ? [
                    {
                        product_id: location.state.productId,
                        variant_id: location.state.variantId,
                        quantity: location.state.quantity,
                        price: location.state.price,
                    },
                ]
                : items.map((item) => ({
                    product_id: item.product_id,
                    variant_id: item.variant_id,
                    quantity: item.quantity,
                    price: parseFloat(item.price),
                }));

            const buyNowTotal = isBuyNow
                ? location.state.price * location.state.quantity
                : total;

            const payload = {
                email: form.email,
                username: form.username,
                phone: form.phone,
                address: form.address,
                province: form.province,
                district: form.district,
                ward: form.ward,
                note: form.note,
                payment: form.payment,
                items: buyNowItem,
                total: buyNowTotal,
            };

            const emailRes = await sendOrderEmail(payload);
            if (emailRes.data.EC !== 0) {
                toast.error(emailRes.data.EM);
                return;
            }

            const orderRes = await saveOrder(payload);

            if (orderRes.EC === 0) {
                if (!isBuyNow && cartId) {
                    await clearCart(Number(cartId));
                }

                toast.success("Đặt hàng thành công!");
                navigate("/home", { replace: true });
            } else {
                toast.error(orderRes.EM);
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi đặt hàng!");
        }
        finally {
            setLoading(false); // 🔥 TẮT LOADING
        }
    };

    {
        loading && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                    <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang xử lý đơn hàng...</span>
                </div>
            </div>
        )
    }
    return (
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-6 mt-[120px]">
            {/* LEFT - SHIPPING INFO */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Thông tin giao hàng</h2>

                <div className="space-y-4">
                    <input name="username" value={form.username} onChange={handleChange} placeholder="Họ và tên" className="w-full border rounded-lg p-3" />
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="Số điện thoại" className="w-full border rounded-lg p-3" />
                    <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border rounded-lg p-3" />
                    <input name="address" value={form.address} onChange={handleChange} placeholder="Địa chỉ" className="w-full border rounded-lg p-3" />

                    <div className="grid grid-cols-2 gap-3">
                        <input name="province" value={form.province} onChange={handleChange} placeholder="Tỉnh / Thành phố" className="border rounded-lg p-3" />
                        <input name="district" value={form.district} onChange={handleChange} placeholder="Quận / Huyện" className="border rounded-lg p-3" />
                    </div>

                    <input name="ward" value={form.ward} onChange={handleChange} placeholder="Phường / Xã" className="w-full border rounded-lg p-3" />

                    <textarea name="note" value={form.note} onChange={handleChange} placeholder="Ghi chú" className="w-full border rounded-lg p-3 h-24" />
                </div>

                <h3 className="text-lg font-semibold mt-6 mb-2">Phương thức thanh toán</h3>
                <label className="flex items-center gap-2">
                    <input type="radio" name="payment" value="COD" checked={form.payment === "COD"} onChange={handleChange} />
                    Thanh toán khi nhận hàng (COD)
                </label>
            </div>

            {/* RIGHT - ORDER SUMMARY */}
            <div className="bg-gray-50 p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">Đơn hàng</h2>

                {items.length === 0 ? (
                    <p>Đang tải sản phẩm...</p>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 mb-4">
                            <img src={item.image} className="w-16 h-16 rounded object-cover bg-gray-200" alt={item.name} />
                            <div className="flex-1">
                                <p>{item.name}</p>
                                <p className="text-sm text-gray-500">{item.color} - {item.size}</p>
                                <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                            </div>
                            <p className="font-semibold">{item.price.toLocaleString()}đ</p>
                        </div>
                    ))
                )}

                <div className="border-t pt-4 mt-4">
                    <p className="text-gray-700 mb-2 text-sm border p-3 rounded">
                        Chúng tôi sẽ XÁC NHẬN đơn hàng bằng TIN NHẮN hoặc GỌI ĐIỆN.
                    </p>

                    <div className="flex justify-between text-lg font-semibold mt-4">
                        <span>Tổng cộng</span>
                        <span>{total.toLocaleString()}đ</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className={`w-full mt-6 py-3 rounded-lg text-white 
               ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}>
                        {loading ? "Đang xử lý..." : "Hoàn tất đơn hàng"}
                    </button>
                </div>
            </div>
        </div>
    );
}
