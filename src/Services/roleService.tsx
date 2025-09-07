import axios from "../setup/axios";

// interface Role {
//     id: number;
//     url: string;
//     description: string;
//     name?: string;
// }

interface NewRole {
    url: string;
    description: string;
}

interface RoleData {
    id?: number;
    name?: string;
    [key: string]: any;
}

export interface AssignToGroupData {
    groupId: number;
    roleId: number[];  // giữ nguyên interface frontend
}

//Tạo danh sách role
const createRoles = (roles: NewRole[]): Promise<any> => {
    return axios.post('/api/v1/role/create', roles);
};

// Lấy tất cả role
const fetchAllRole = (): Promise<any> => {
    return axios.get(`/api/v1/role/read`);
};

//Xoá 1 role
const deleteRole = (role: { id: number }): Promise<any> => {
    return axios.delete(`/api/v1/role/delete`, { data: { id: role.id } });
};

// Cập nhật role
const updateUser = (roleData: RoleData): Promise<any> => {
    return axios.put(`/api/v1/role/update`, { ...roleData });
};

// Lấy role theo group
const fetchRoleByGroup = (groupId: number): Promise<any> => {
    return axios.get(`/api/v1/role/by-group/${groupId}`);
};

// Gán role vào group (frontend map payload sang backend format)
const assignToGroup = (data: AssignToGroupData): Promise<any> => {
    const roleIds = data.roleId || []; // nếu undefined → []
    const payload = {
        groupId: data.groupId,
        groupRoles: roleIds.map(roleId => ({ groupId: data.groupId, roleId }))
    };
    return axios.post('/api/v1/role/assign-to-group', payload);
};

export {
    createRoles,
    fetchAllRole,
    deleteRole,
    fetchRoleByGroup,
    assignToGroup,
    updateUser
};
