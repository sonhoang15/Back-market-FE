import React from 'react';
import './GroupRole.scss'
import { useState, useEffect } from 'react';
import { fetchGroups } from '../../Services/userService';
import { toast } from 'react-toastify';
import { fetchAllRole, fetchRoleByGroup, assignToGroup } from '../../Services/roleService'
import _ from 'lodash';

const GroupRole = (props) => {
    const [userGroups, setuserGroups] = useState([]);
    const [listRoles, setListRoles] = useState([]);
    const [selectGroup, setSelectGroups] = useState("");
    const [assignRoleByGroup, setAssignRoleByGroup] = useState([])
    useEffect(() => {
        getGroups();
        getAllRoles()
    }, []);
    const getGroups = async () => {
        let res = await fetchGroups();
        if (res && +res.EC === 0) {
            setuserGroups(res.DT);
        } else {
            toast.error(res.EM);
        }
    }
    const getAllRoles = async () => {
        let data = await fetchAllRole()
        if (data && +data.EC === 0) {
            setListRoles(data.DT)
        } else {
            console.error("Failed to fetch roles");
        }
    }
    const handleOnchangeGroup = async (value) => {
        setSelectGroups(value)
        if (value) {
            let data = await fetchRoleByGroup(value)
            if (data && +data.EC === 0) {
                let result = buildDataRoleByGroup(data.DT.Roles, listRoles)
                setAssignRoleByGroup(result)
            }
        }
    }
    const buildDataRoleByGroup = (groupRoles, allRoles) => {
        let result = [];
        if (allRoles && allRoles.length > 0) {
            allRoles.map(role => {
                let object = {};
                object.url = role.url;
                object.id = role.id
                object.description = role.description;
                object.isAssigned = false
                if (groupRoles && groupRoles.length > 0) {
                    object.isAssigned = groupRoles.some(item => item.url === object.url)
                }
                result.push(object)
            })
        }
        return result;
    }


    const handleSelectRoles = (value) => {
        const _assignRoleByGroup = _.cloneDeep(assignRoleByGroup);
        let foundIndex = _assignRoleByGroup.findIndex(item => +item.id == +value);
        if (foundIndex > -1) {
            _assignRoleByGroup[foundIndex].isAssigned = !_assignRoleByGroup[foundIndex].isAssigned
        }
        setAssignRoleByGroup(_assignRoleByGroup)
    }

    const buildDataToSave = () => {
        let result = {};
        const _assignRoleByGroup = _.cloneDeep(assignRoleByGroup);
        result.groupId = selectGroup
        let groupRolesFilter = _assignRoleByGroup.filter(item => item.isAssigned === true)
        let finalGroupRoles = groupRolesFilter.map(item => {
            let data = { groupId: +selectGroup, roleId: +item.id }
            return data
        })
        result.groupRoles = finalGroupRoles;
        return result
    }

    const handleSave = async () => {
        let data = buildDataToSave()
        let res = await assignToGroup(data)
        if (res && res.EC === 0) {
            toast.success(res.EM);
        } else {
            toast.error(res.EM);
        }
    }

    return (
        <div className='group-role-container'>
            <div className=' container'>
                <div className='container mt-3'>
                    <h4>Group Roles:</h4>
                    <div className='assign-group-role'>
                        <div className='col-12 col-sm-6 form-group'>
                            <label> Select Group:</label>
                            <select
                                className={'form-select'}
                                onChange={(event) => handleOnchangeGroup(event.target.value)}
                            >
                                <option value=''>Select your group</option>
                                {userGroups && userGroups.length > 0 &&
                                    userGroups.map((item, index) => {
                                        return (
                                            <option key={`group-${index}`} value={item.id}>{item.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <hr />
                        {selectGroup &&
                            <div className='roles'>
                                <h5>Assign Roles:</h5>
                                {
                                    assignRoleByGroup && assignRoleByGroup.length > 0
                                    && assignRoleByGroup.map((item, index) => {
                                        return (
                                            <div className="form-check" key={`list-role-${index}`}>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value={item.id}
                                                    id={`list-role-${index}`}
                                                    checked={item.isAssigned}
                                                    onChange={(event) => handleSelectRoles(event.target.value)}
                                                />
                                                <label className="form-check-label" htmlFor={`list-role-${index}`}>
                                                    {item.url}
                                                </label>
                                            </div>
                                        )
                                    })
                                }
                                <div className=' mt3'>
                                    <button className='btn btn-warning' onClick={() => handleSave()}>save</button>
                                </div>
                            </div>
                        }


                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupRole;