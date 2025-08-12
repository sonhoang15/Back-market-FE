import React from 'react';

interface ModalDeleteProps {
    show: boolean;
    handleClose: () => void;
    ConfirmDelete: () => void;
    userToDelete: {
        email: string;
    };
}

const ModalDelete: React.FC<ModalDeleteProps> = ({
    show,
    handleClose,
    ConfirmDelete,
    userToDelete,
}) => {
    if (!show) return null; // Ẩn modal khi show = false

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 animate-fadeIn">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Confirm delete user
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="py-4 text-gray-700">
                    Woohoo, are you sure to delete user:{" "}
                    <span className="font-medium text-red-600">
                        {userToDelete.email}
                    </span>
                    ?
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                    >
                        Close
                    </button>
                    <button
                        onClick={ConfirmDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalDelete;
