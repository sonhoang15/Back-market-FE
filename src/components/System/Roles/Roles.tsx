import React, { useState, useRef } from "react";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { createRoles } from "../../../Services/roleService";
import TableRoles from "./TableRoles";

interface RoleChild {
    url: string;
    description: string;
    isValidUrl: boolean;
}

interface TableRolesRef {
    fecthListRole: () => void;
}

const Roles: React.FC = () => {
    const dataChildDefault: RoleChild = {
        url: "",
        description: "",
        isValidUrl: true,
    };

    const childRef = useRef<TableRolesRef>(null);

    const [listChilds, setListChilds] = useState<Record<string, RoleChild>>({
        child: { ...dataChildDefault },
    });

    const handleOnchangeInput = (
        name: keyof RoleChild,
        value: string,
        key: string
    ) => {
        const _listChilds = _.cloneDeep(listChilds);
        (_listChilds[key][name] as unknown as string) = value;

        if (value && name === "url") {
            _listChilds[key].isValidUrl = true;
        }
        setListChilds(_listChilds);
    };

    const handleAddNewInput = () => {
        const _listChilds = _.cloneDeep(listChilds);
        _listChilds[`child ${uuidv4()}`] = { ...dataChildDefault };
        setListChilds(_listChilds);
    };

    const handleDeleteInput = (key: string) => {
        const _listChilds = _.cloneDeep(listChilds);
        delete _listChilds[key];
        setListChilds(_listChilds);
    };

    const buildDataToPersist = () => {
        return Object.values(listChilds).map((child) => ({
            url: child.url,
            description: child.description,
        }));
    };

    const handleSave = async () => {
        const invalidObj = Object.entries(listChilds).find(
            ([, child]) => !child.url
        );

        if (!invalidObj) {
            const data = buildDataToPersist();
            const res = await createRoles(data);
            if (res && res.EC === 0) {
                toast.success(res.EM);
                childRef.current?.fecthListRole();
                setListChilds({ child: { ...dataChildDefault } });
            }
        } else {
            toast.error("Input URL empty");
            const _listChilds = _.cloneDeep(listChilds);
            const key = invalidObj[0];
            _listChilds[key].isValidUrl = false;
            setListChilds(_listChilds);
        }
    };

    return (
        <div className="p-4">
            <div className="max-w-5xl mx-auto">
                <div className="mt-3">
                    <h4 className="text-lg font-semibold mb-4">New Roles</h4>
                    <div className="space-y-4">
                        {Object.entries(listChilds).map(([key, child], index) => (
                            <div
                                key={`child-${key}`}
                                className="flex flex-wrap items-start gap-4"
                            >
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block mb-1 font-medium">URL:</label>
                                    <input
                                        aria-label="URL"
                                        title="URL"
                                        type="text"
                                        className={`w-full border rounded px-3 py-2 outline-none focus:ring-2 ${child.isValidUrl
                                            ? "border-gray-300 focus:ring-blue-500"
                                            : "border-red-500 focus:ring-red-500"
                                            }`}
                                        value={child.url}
                                        onChange={(e) =>
                                            handleOnchangeInput("url", e.target.value, key)
                                        }
                                    />
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block mb-1 font-medium">Description:</label>
                                    <input
                                        aria-label="Description"
                                        title="Description"
                                        type="text"
                                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                        value={child.description}
                                        onChange={(e) =>
                                            handleOnchangeInput("description", e.target.value, key)
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-3 pt-6">
                                    <i
                                        className="fa fa-plus text-green-600 text-xl cursor-pointer"
                                        onClick={handleAddNewInput}
                                    ></i>
                                    {index >= 1 && (
                                        <i
                                            className="fa fa-trash text-red-600 text-xl cursor-pointer"
                                            onClick={() => handleDeleteInput(key)}
                                        ></i>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div>
                            <button
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mt-3"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
                <hr className="my-6" />
                <div className="mt-3">
                    <h4 className="text-lg font-semibold mb-4">List Role</h4>
                    <TableRoles ref={childRef} />
                </div>
            </div>
        </div>
    );
};

export default Roles;
