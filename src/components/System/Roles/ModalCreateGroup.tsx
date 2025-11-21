import { useState } from "react";
import { createGroup } from "../../../Services/roleService";
import { toast } from "react-toastify";

interface ModalCreateGroupProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated?: (group: { id: number; name: string; description: string }) => void;
}

const ModalCreateGroup: React.FC<ModalCreateGroupProps> = ({
    isOpen,
    onClose,
    onCreated,
}) => {
    const [newGroupName, setNewGroupName] = useState("");
    const [newGroupDesc, setNewGroupDesc] = useState("");
    const [groupError, setGroupError] = useState("");

    const handleCreateGroup = async () => {
        if (!newGroupName.trim()) {
            setGroupError("Group name is required");
            return;
        }

        try {
            const res = await createGroup({
                name: newGroupName,
                description: newGroupDesc,
            });

            const responseData = res.data ?? res;

            if (responseData && +responseData.EC === 0) {
                toast.success(responseData.EM || "Group created successfully!");


                if (onCreated) {
                    onCreated(responseData.DT);
                }


                setNewGroupName("");
                setNewGroupDesc("");
                setGroupError("");
                onClose();
            } else {
                setGroupError(responseData?.EM || "Không thể tạo group!");
            }
        } catch (err) {
            console.error("Lỗi khi tạo group:", err);
            setGroupError("Không thể tạo group, thử lại sau!");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 relative">

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>

                <h5 className="text-lg font-semibold mb-4 text-gray-800">
                    Create New Group
                </h5>

                <input
                    type="text"
                    placeholder="Group name *"
                    value={newGroupName}
                    onChange={(e) => {
                        setNewGroupName(e.target.value);
                        if (e.target.value.trim()) setGroupError("");
                    }}
                    className={`w-full border rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${groupError ? "border-red-500" : "border-gray-300"
                        }`}
                />
                {groupError && (
                    <p className="text-red-500 text-sm mb-3">{groupError}</p>
                )}

                <textarea
                    placeholder="Description"
                    value={newGroupDesc}
                    onChange={(e) => setNewGroupDesc(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        type="button"
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-5 py-2 rounded-lg shadow"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateGroup}
                        type="button"
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow"
                    >
                        + Add Group
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalCreateGroup;
