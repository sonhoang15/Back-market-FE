import React, { forwardRef, useImperativeHandle } from 'react';

interface RoleToDelete {
    url: string;
}

interface ModalDeleteRoleProps {
    show: boolean;
    handleClose: () => void;
    ConfirmDelete: () => void;
    roleToDelete: RoleToDelete;
}

export interface TableRolesRef {
    fetchListRole: () => void;
}

const ModalDeleteRole = forwardRef<TableRolesRef, ModalDeleteRoleProps>(
    ({ show, handleClose, ConfirmDelete, roleToDelete }, ref) => {

        // Expose method ra ngoài qua ref
        useImperativeHandle(ref, () => ({
            fetchListRole() {
                console.log("fetchListRole từ ModalDeleteRole");
                // logic fetch
            }
        }));

        if (!show) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                    <div className="flex justify-between items-center border-b px-4 py-3">
                        <h2 className="text-lg font-semibold">Confirm delete user</h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-500 hover:text-gray-800 text-xl font-bold"
                        >
                            &times;
                        </button>
                    </div>
                    <div className="px-4 py-4">
                        Woohoo, are you sure to delete user:{" "}
                        <span className="font-medium text-red-500">{roleToDelete.url}</span>?
                    </div>
                    <div className="flex justify-end gap-2 border-t px-4 py-3">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800"
                        >
                            Close
                        </button>
                        <button
                            onClick={ConfirmDelete}
                            className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        );
    }
);

export default ModalDeleteRole;