import axios from "../setup/axios";


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
    roleId: number[];
}

export interface ApiResponse<T = any> {
    EC: number;
    EM: string;
    DT: T | null;
}


const createRoles = (roles: NewRole[]): Promise<any> => {
    return axios.post('/api/v1/role/create', roles);
};


const fetchAllRole = (): Promise<any> => {
    return axios.get(`/api/v1/role/read`);
};


const deleteRole = (role: { id: number }): Promise<any> => {
    return axios.delete(`/api/v1/role/delete`, { data: { id: role.id } });
};


const updateUser = (roleData: RoleData): Promise<any> => {
    return axios.put(`/api/v1/role/update`, { ...roleData });
};


const fetchRoleByGroup = (groupId: number): Promise<any> => {
    return axios.get(`/api/v1/role/by-group/${groupId}`);
};

const assignToGroup = (data: AssignToGroupData): Promise<any> => {
    const roleIds = data.roleId || [];
    const payload = {
        groupId: data.groupId,
        groupRoles: roleIds.map(roleId => ({ groupId: data.groupId, roleId }))
    };
    return axios.post('/api/v1/role/assign-to-group', payload);
};

const createGroup = (data: { name: string; description: string }) => {
    return axios.post("/api/v1/group/create", data);
};
const deleteGroup = (group: { id: number }): Promise<any> => {
    return axios.delete(`/api/v1/group/delete`, { data: { id: group.id } });
};

export {
    createGroup,
    createRoles,
    fetchAllRole,
    deleteRole,
    fetchRoleByGroup,
    assignToGroup,
    updateUser,
    deleteGroup
};
