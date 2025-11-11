import React from "react";

interface ModalDeleteProps {
    show: boolean;
    title?: string;
    message?: string;
    onClose: () => void;
    onConfirm: () => void;
}

const ModalDelete: React.FC<ModalDeleteProps> = ({
    show,
    title = "Xác nhận xóa",
    message = "Bạn có chắc muốn xóa không?",
    onClose,
    onConfirm,
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 animate-fadeIn">
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        ✕
                    </button>
                </div>

                <div className="py-4 text-gray-700">{message}</div>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalDelete;
