import React, { useEffect, useState } from 'react';
import { fetchGroups, createNewUser, updateUser } from '../../../Services/userService';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { Group, UserData, ValidInputs, ModalUserProps } from './ModalUser.types';

const ModalUser: React.FC<ModalUserProps> = ({
    show,
    hide,
    action,
    dataModalUser,
}) => {
    const defaultUserdata: UserData = {
        id: 0,
        email: '',
        username: '',
        phone: '',
        password: '',
        address: '',
        group: '',
    };

    const validInputsDefault: ValidInputs = {
        email: true,
        username: true,
        phone: true,
        password: true,
        address: true,
        group: true,
    };

    const [userData, setUserData] = useState<UserData>(defaultUserdata);
    const [groups, setGroups] = useState<Group[]>([]);
    const [validInputs, setValidInput] = useState<ValidInputs>(validInputsDefault);

    useEffect(() => {
        getGroups();
    }, []);

    useEffect(() => {
        if (action === 'UPDATE') {
            setUserData({
                ...dataModalUser,
                group: dataModalUser.Group ? dataModalUser.Group.id : '',
            });
        }
    }, [dataModalUser]);

    useEffect(() => {
        if (action === 'CREATE' && groups.length > 0) {
            setUserData({ ...defaultUserdata, group: groups[0].id });
        }
    }, [action, groups]);

    const getGroups = async () => {
        let res = await fetchGroups();
        if (res && +res.EC === 0) {
            setGroups(res.DT);
            if (res.DT && res.DT.length > 0) {
                setUserData({ ...userData, group: res.DT[0].id });
            }
        } else {
            toast.error(res.EM);
        }
    };

    const handleChange = <K extends keyof Omit<UserData, 'id'>>(
        value: UserData[K],
        key: K
    ) => {
        const _userData = { ...userData, [key]: value };
        setUserData(_userData);
    };
    const checkValidInput = () => {
        if (action === 'UPDATE') return true;
        setValidInput(validInputsDefault);
        let arr: (keyof UserData)[] = ['email', 'phone', 'password', 'group'];
        let check = true;
        for (let key of arr) {
            if (!userData[key]) {
                let _validInputs = _.cloneDeep(validInputsDefault);
                _validInputs[key as keyof ValidInputs] = false;
                setValidInput(_validInputs);
                toast.error(`Empty input ${key}`);
                check = false;
                break;
            }
        }
        return check;
    };

    const ConfirmUser = async () => {
        let check = checkValidInput();
        if (check) {
            let res =
                action === 'CREATE'
                    ? toast.success('Create success...') &&
                    (await createNewUser({ ...userData, groupId: userData['group'] }))
                    : toast.success('Update success...') &&
                    (await updateUser({ ...userData, groupId: userData['group'] }));

            if (res && res.EC === 0) {
                hide();
                setUserData({
                    ...defaultUserdata,
                    group: groups.length > 0 ? groups[0].id : '',
                });
            }
            if (res && res.EC !== 0) {
                toast.error(res.EM);
                let _validInputs = _.cloneDeep(validInputsDefault);
                _validInputs[res.DT as keyof ValidInputs] = false;
                setValidInput(_validInputs);
            }
        }
    };

    const handleCloseModalUser = () => {
        hide();
        setUserData(defaultUserdata);
        setValidInput(validInputsDefault);
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-6">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {action === 'CREATE' ? 'Create new user' : 'Edit user'}
                    </h2>
                    <button
                        onClick={handleCloseModalUser}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            disabled={action !== 'CREATE'}
                            type="email"
                            className={`mt-1 block w-full rounded-md border px-3 py-2 ${validInputs.email
                                ? 'border-gray-300'
                                : 'border-red-500 focus:border-red-500'
                                }`}
                            value={userData.email}
                            onChange={(e) => handleChange(e.target.value, 'email')}
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium">Username</label>
                        <input
                            type="text"
                            className={`mt-1 block w-full rounded-md border px-3 py-2 ${validInputs.username
                                ? 'border-gray-300'
                                : 'border-red-500 focus:border-red-500'
                                }`}
                            value={userData.username}
                            onChange={(e) => handleChange(e.target.value, 'username')}
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium">Phone</label>
                        <input
                            disabled={action !== 'CREATE'}
                            type="text"
                            className={`mt-1 block w-full rounded-md border px-3 py-2 ${validInputs.phone
                                ? 'border-gray-300'
                                : 'border-red-500 focus:border-red-500'
                                }`}
                            value={userData.phone}
                            onChange={(e) => handleChange(e.target.value, 'phone')}
                        />
                    </div>

                    {/* Password */}
                    {action === 'CREATE' && (
                        <div>
                            <label className="block text-sm font-medium">Password</label>
                            <input
                                type="password"
                                className={`mt-1 block w-full rounded-md border px-3 py-2 ${validInputs.password
                                    ? 'border-gray-300'
                                    : 'border-red-500 focus:border-red-500'
                                    }`}
                                value={userData.password}
                                onChange={(e) => handleChange(e.target.value, 'password')}
                            />
                        </div>
                    )}

                    {/* Address */}
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium">Address</label>
                        <input
                            type="text"
                            className={`mt-1 block w-full rounded-md border px-3 py-2 ${validInputs.address
                                ? 'border-gray-300'
                                : 'border-red-500 focus:border-red-500'
                                }`}
                            value={userData.address}
                            onChange={(e) => handleChange(e.target.value, 'address')}
                        />
                    </div>

                    {/* Group */}
                    <div>
                        <label className="block text-sm font-medium">Group</label>
                        <select
                            className={`mt-1 block w-full rounded-md border px-3 py-2 ${validInputs.group
                                ? 'border-gray-300'
                                : 'border-red-500 focus:border-red-500'
                                }`}
                            onChange={(e) => handleChange(e.target.value, 'group')}
                            value={userData.group}
                        >
                            {groups.map((group, index) => (
                                <option key={index} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                    <button
                        onClick={handleCloseModalUser}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                    >
                        Close
                    </button>
                    <button
                        onClick={ConfirmUser}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        {action === 'CREATE' ? 'Save' : 'Update'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalUser;
