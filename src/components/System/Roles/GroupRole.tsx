import React, { useState, useEffect } from 'react';
import { fetchGroups } from '../../../Services/userService';
import { toast } from 'react-toastify';
import { fetchAllRole, fetchRoleByGroup, assignToGroup, createGroup, deleteGroup } from '../../../Services/roleService';
import { AssignToGroupData } from '../../../Services/roleService';


import _ from 'lodash';

interface Group {
    id: number;
    name: string;
    description: string;
}

interface Role {
    id: number;
    url: string;
    description: string;
}

interface RoleWithAssign extends Role {
    isAssigned: boolean;
}

interface ApiResponse<T> {
    EC: number;
    EM: string;
    DT: T;
}

interface RoleByGroupResponse {
    Roles: Role[];
}

const GroupRole: React.FC = () => {
    const [userGroups, setUserGroups] = useState<Group[]>([]);
    const [listRoles, setListRoles] = useState<Role[]>([]);
    const [selectGroup, setSelectGroup] = useState<number | ''>('');
    const [assignRoleByGroup, setAssignRoleByGroup] = useState<RoleWithAssign[]>([]);
    const [newGroupName, setNewGroupName] = useState("");
    const [newGroupDesc, setNewGroupDesc] = useState("");
    const [groupError, setGroupError] = useState("");

    useEffect(() => {
        getGroups();
        getAllRoles();
    }, []);

    const getGroups = async () => {
        let res: ApiResponse<Group[]> = await fetchGroups();
        if (res && +res.EC === 0) {
            setUserGroups(res.DT);
        } else {
            toast.error(res.EM);
        }
    };

    const getAllRoles = async () => {
        let data: ApiResponse<Role[]> = await fetchAllRole();
        if (data && +data.EC === 0) {
            setListRoles(data.DT);
        } else {
            console.error('Failed to fetch roles');
        }
    };

    const handleOnchangeGroup = async (value: string) => {
        const groupId = value ? Number(value) : '';
        setSelectGroup(groupId);
        if (groupId) {
            let data: ApiResponse<RoleByGroupResponse> = await fetchRoleByGroup(groupId);
            if (data && +data.EC === 0) {
                let result = buildDataRoleByGroup(data.DT.Roles, listRoles);
                setAssignRoleByGroup(result);
            } else {
                setAssignRoleByGroup([]); // luôn set default mảng
            }
        }
    };

    const buildDataRoleByGroup = (groupRoles: Role[], allRoles: Role[]): RoleWithAssign[] => {
        let result: RoleWithAssign[] = [];
        if (allRoles && allRoles.length > 0) {
            allRoles.forEach(role => {
                let object: RoleWithAssign = {
                    ...role,
                    isAssigned: groupRoles?.some(item => item.url === role.url) || false
                };
                result.push(object);
            });
        }
        return result;
    };

    const handleSelectRoles = (value: string) => {
        const _assignRoleByGroup = _.cloneDeep(assignRoleByGroup);
        let foundIndex = _assignRoleByGroup.findIndex(item => +item.id === +value);
        if (foundIndex > -1) {
            _assignRoleByGroup[foundIndex].isAssigned = !_assignRoleByGroup[foundIndex].isAssigned;
        }
        setAssignRoleByGroup(_assignRoleByGroup);
    };

    const buildDataToSave = (): AssignToGroupData => {
        const assignedRoles = assignRoleByGroup.filter(role => role.isAssigned);
        return {
            groupId: Number(selectGroup),
            roleId: assignedRoles.map(role => role.id)
        };
    };

    const handleSave = async () => {
        let data = buildDataToSave();
        console.log("Payload to send:", data);
        let res: ApiResponse<null> = await assignToGroup(data);
        if (res && res.EC === 0) {
            toast.success(res.EM);
        } else {
            toast.error(res.EM);
        }
    };

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
                setUserGroups([...userGroups, responseData.DT]);

                setNewGroupName("");
                setNewGroupDesc("");
                setGroupError("");

                toast.success(responseData.EM || "Group created successfully!");
            } else {
                setGroupError(responseData?.EM || "Không thể tạo group!");
            }
        } catch (err) {
            console.error("Lỗi khi tạo group:", err);
            setGroupError("Không thể tạo group, thử lại sau!");
        }
    };


    const handleDeleteGroup = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa group này?")) return;

        try {
            if (!id) {
                toast.error("GroupId không hợp lệ!");
                return;
            }

            const res = await deleteGroup({ id });

            if (!res) {
                toast.error("Không nhận được phản hồi từ server!");
                return;
            }

            // ép kiểu EC an toàn
            const ecNumber = Number(res.EC);

            if (!isNaN(ecNumber) && ecNumber === 0) {
                // xóa thành công → cập nhật state userGroups
                setUserGroups(prev => prev.filter(group => group.id !== id));
                toast.success(res.EM || "Xóa group thành công!");
            } else {
                // xóa thất bại → hiển thị thông báo lỗi từ backend
                toast.error(res.EM || "Không thể xóa group!");
            }
        } catch (err) {
            console.error("Lỗi khi xóa group:", err);
            toast.error("Không thể xóa group, thử lại sau!");
        }
    };

    return (
        <div className="group-role-container">
            <div className="container mt-3 mx-auto">
                <h4 className="text-lg font-semibold mb-3">Group Roles:</h4>
                <div className="assign-group-role">
                    <div className="w-full sm:w-1/2 mb-6">
                        <h5 className="text-md font-semibold mb-2">Create New Group</h5>

                        <input
                            type="text"
                            placeholder="Group name *"
                            value={newGroupName}
                            onChange={(e) => {
                                setNewGroupName(e.target.value);
                                if (e.target.value.trim()) setGroupError("");
                            }}
                            className={`w-full border p-2 rounded mb-2 ${groupError ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {groupError && <p className="text-red-500 text-sm mb-2">{groupError}</p>}

                        <textarea
                            placeholder="Description"
                            value={newGroupDesc}
                            onChange={(e) => setNewGroupDesc(e.target.value)}
                            className="w-full border p-2 rounded mb-2 border-gray-300"
                            rows={2}
                        />

                        <button
                            onClick={handleCreateGroup}
                            type="button"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        >
                            + Add Group
                        </button>
                    </div>
                    {userGroups.map(group => (
                        <div key={group.id} className="flex justify-between items-center border p-2 mb-2 rounded">
                            <div>
                                <p className="font-semibold">{group.name}</p>
                                <p className="text-sm text-gray-500">{group.description}</p>
                            </div>
                            <button
                                onClick={() => handleDeleteGroup(group.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                    <div className="w-full sm:w-1/2 mb-4">
                        <label className="block mb-2 font-medium">Select Group:</label>
                        <select
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(event) => handleOnchangeGroup(event.target.value)}
                        >
                            <option value="">Select your group</option>
                            {userGroups &&
                                userGroups.length > 0 &&
                                userGroups.map((item, index) => (
                                    <option key={`group-${index}`} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <hr className="my-4 border-gray-300" />

                    {selectGroup && (
                        <div className="roles">
                            <h5 className="text-md font-semibold mb-3">Assign Roles:</h5>
                            {assignRoleByGroup &&
                                assignRoleByGroup.length > 0 &&
                                assignRoleByGroup.map((item, index) => (
                                    <div
                                        className="flex items-center mb-2 space-x-2"
                                        key={`list-role-${index}`}
                                    >
                                        <input
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            type="checkbox"
                                            value={item.id}
                                            id={`list-role-${index}`}
                                            checked={item.isAssigned}
                                            onChange={(event) => handleSelectRoles(event.target.value)}
                                        />
                                        <label
                                            className="text-gray-700"
                                            htmlFor={`list-role-${index}`}
                                        >
                                            {item.url}
                                        </label>
                                    </div>
                                ))}
                            <div className="mt-4">
                                <button
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded-md"
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupRole;
