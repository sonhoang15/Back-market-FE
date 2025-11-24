import { useEffect, useState } from "react";
import * as orderService from "../../../Services/profileService";
import { toast } from "react-toastify";

export interface Order {
    id: number;
    username: string;
    phone: string;
    email: string;
    status: string;
    total_price: number;
    payment_method: string;
    createdAt: string;
    items: OrderItem[];
}

export interface OrderItem {
    id: number;
    product_id: number;
    product?: {
        name: string;
    };
    variant?: {
        name: string;
    };
    quantity: number;
    price: number;
    total_price: number;
}


export default function OrderAdminPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await orderService.getAllOrders();
            if (res?.EC === 0) {
                setOrders(res.DT);
            }
        };
        fetchData();
    }, []);

    const handleViewDetail = async (id: number) => {
        const res = await orderService.getOrderDetail(id);
        if (res?.EC === 0) {
            setSelectedOrder(res.DT);
        }
    };


    const handleShipOrder = async (id: number) => {
        try {
            const res = await orderService.updateOrderStatus(id, "completed");

            if (res?.EC === 0) {
                toast.success("Đơn hàng đã được chuyển sang trạng thái hoàn thành!");

                const list = await orderService.getAllOrders();
                if (list?.EC === 0) setOrders(list.DT);

                const detail = await orderService.getOrderDetail(id);
                if (detail?.EC === 0) setSelectedOrder(detail.DT);
            } else {
                toast.error(res?.EM || "Có lỗi xảy ra!");
            }
        } catch (error) {
            toast.error("Không thể cập nhật đơn hàng!");
        }
    };

    return (
        <div className="p-6 w-full">
            <h1 className="text-3xl font-semibold mb-6">Quản lý đơn hàng</h1>

            <div className="bg-white shadow rounded-xl p-4">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b text-gray-600">
                            <th className="py-3">Mã</th>
                            <th>Khách hàng</th>
                            <th>SĐT</th>
                            <th>Email</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Ngày đặt</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((o) => (
                            <tr key={o.id} className="border-b hover:bg-gray-50">
                                <td className="py-3">#{o.id}</td>
                                <td>{o.username}</td>
                                <td>{o.phone}</td>
                                <td>{o.email}</td>
                                <td>{Number(o.total_price).toLocaleString()}₫</td>
                                <td>
                                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                                        {o.status}
                                    </span>
                                </td>
                                <td>{new Date(o.createdAt).toLocaleString()}</td>
                                <td>
                                    <button
                                        className="text-blue-600 hover:underline"
                                        onClick={() => handleViewDetail(o.id)}
                                    >
                                        Xem chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end">
                    <div className="w-[480px] bg-white h-full p-6 shadow-xl overflow-y-auto">
                        <button
                            className="text-gray-600 hover:text-black mb-4"
                            onClick={() => setSelectedOrder(null)}
                        >
                            ✕ Đóng
                        </button>

                        <h2 className="text-2xl font-bold mb-4">
                            Chi tiết đơn #{selectedOrder.id}
                        </h2>

                        <div className="mb-6">
                            <h3 className="font-semibold mb-2 text-gray-700">Thông tin đơn</h3>
                            <p><b>Ngày đặt:</b> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                            <p><b>Thanh toán:</b> {selectedOrder.payment_method}</p>
                            <p><b>Trạng thái:</b> {selectedOrder.status}</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold mb-2 text-gray-700">Sản phẩm</h3>

                            {selectedOrder.items.map((item) => (
                                <div key={item.id} className="p-3 border rounded-lg mb-3">
                                    <p className="font-medium">{item.product?.name}</p>
                                    <p className="text-sm text-gray-500">{item.variant?.name}</p>

                                    <p>Số lượng: {item.quantity}</p>
                                    <p>Giá: {Number(item.price).toLocaleString()}₫</p>

                                    <p className="font-semibold">
                                        Thành tiền: {Number(item.total_price).toLocaleString()}₫
                                    </p>
                                </div>
                            ))}
                        </div>

                        {selectedOrder.status === "pending" && (
                            <button
                                onClick={() => handleShipOrder(selectedOrder.id)}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg mb-4 hover:bg-blue-700 transition"
                            >
                                Gửi hàng
                            </button>
                        )}

                        <div className="text-xl font-bold text-right">
                            Tổng: {Number(selectedOrder.total_price).toLocaleString()}₫
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
