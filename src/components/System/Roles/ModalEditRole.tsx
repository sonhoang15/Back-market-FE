import React, { useEffect, useState } from 'react';
import { fetchAllRole, updateUser } from '../../../Services/roleService';
import { toast } from 'react-toastify';
import _ from 'lodash';

interface RoleData {
    url: string;
    description: string;
    [key: string]: any;
}

interface ValidInputs {
    url: boolean;
    description: boolean;
}

interface ModalEditRoleProps {
    Title: string;
    show: boolean;
    hide: () => void;
    action: 'UPDATE' | string;
    dataModalRole: RoleData | null;
}

const defaultUserdata: RoleData = {
    url: '',
    description: '',
};

const validInputsDefault: ValidInputs = {
    url: true,
    description: true,
};

const ModalEditRole: React.FC<ModalEditRoleProps> = ({ action, dataModalRole, show, hide }) => {
    const [roleData, setRoleData] = useState<RoleData>(defaultUserdata);
    const [validInputs, setValidInput] = useState<ValidInputs>(validInputsDefault);

    useEffect(() => {
        if (dataModalRole) {
            setRoleData({ ...dataModalRole });
        } else {
            setRoleData(defaultUserdata);
        }
    }, [dataModalRole]);

    const handleChange = (value: string, name: keyof RoleData) => {
        let _roleData = _.cloneDeep(roleData);
        _roleData[name] = value;
        setRoleData(_roleData);
    };

    const checkValidInput = (): boolean => {
        if (action === 'UPDATE') return true;
        setValidInput(validInputsDefault);
        const arr: (keyof ValidInputs)[] = ['url', 'description'];
        let check = true;
        for (let i = 0; i < arr.length; i++) {
            if (!roleData[arr[i]]) {
                let _validInputs = _.cloneDeep(validInputsDefault);
                _validInputs[arr[i]] = false;
                setValidInput(_validInputs);
                toast.error(`Empty input ${arr[i]}`);
                check = false;
                break;
            }
        }
        return check;
    };

    const ConfirmRole = async () => {
        let check = checkValidInput();
        if (check === true) {
            let res = await updateUser({ ...roleData });
            if (res && res.EC === 0) {
                toast.success('Update succeeded...');
                hide();
                setRoleData({ ...defaultUserdata });
            }
            if (res && res.EC !== 0) {
                toast.error(res.EM);
                let _validInputs = _.cloneDeep(validInputsDefault);
                if (res.DT && typeof res.DT === 'string' && res.DT in _validInputs) {
                    _validInputs[res.DT as keyof ValidInputs] = false;
                }
                setValidInput(_validInputs);
            }
        }
    };

    const handleCloseModalRole = () => {
        hide();
        setRoleData(defaultUserdata);
        setValidInput(validInputsDefault);
    };

    // Nếu không dùng thư viện modal, ta tạo overlay + modal custom bằng tailwind
    if (!show) return null;

    return (
        <>
            {/* Background overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={handleCloseModalRole}
            ></div>

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div
                    className="bg-white rounded-lg shadow-lg w-full max-w-3xl"
                    onClick={(e) => e.stopPropagation()} // tránh click lan ra overlay
                >
                    {/* Header */}
                    <div className="border-b px-6 py-4 flex justify-between items-center">
                        <h5 className="text-lg font-semibold">Edit Role</h5>
                        <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={handleCloseModalRole}
                            aria-label="Close"
                        >
                            &#10005;
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">Url</label>
                            <input
                                aria-label="Url"
                                title="Url"
                                type="text"
                                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${validInputs.url ? 'border-gray-300' : 'border-red-500'
                                    }`}
                                value={roleData.url}
                                onChange={(e) => handleChange(e.target.value, 'url')}
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Description</label>
                            <input
                                aria-label="Description"
                                title="Description"
                                type="text"
                                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${validInputs.description ? 'border-gray-300' : 'border-red-500'
                                    }`}
                                value={roleData.description}
                                onChange={(e) => handleChange(e.target.value, 'description')}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t px-6 py-4 flex justify-end space-x-3">
                        <button
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                            onClick={handleCloseModalRole}
                        >
                            Close
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            onClick={ConfirmRole}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModalEditRole;
