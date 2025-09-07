import React, { useState, useEffect } from 'react';
import { fetchAllUsers, deleteUser } from '../../../Services/userService';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import ModalDelete from './ModalDelete';
import ModalUser from './ModalUser';
import { FaPencilAlt, FaTrash } from "react-icons/fa";

// Kiểu dữ liệu Group
interface Group {
    name: string;
}

// Kiểu dữ liệu User
export interface UserType {
    id: number;
    email: string;
    username: string;
    Group?: Group | null;
}

// Kiểu dữ liệu trả về khi fetch users
interface FetchUserResponse {
    EC: number;
    EM: string;
    DT: {
        totalPage: number;
        users: UserType[];
    };
}

const User: React.FC = () => {
    const [listUser, setListUser] = useState<UserType[]>([]);
    const [itemOffset, setItemOffset] = useState<number>(1);
    const [itemLimit, setItemLimit] = useState<number>(5);
    const [pageCount, setPageCount] = useState<number>(0);
    const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
    const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
    const [isShowModalUser, setShowModalUser] = useState<boolean>(false);
    const [actionModalUser, setActionModalUser] = useState<"CREATE" | "UPDATE">("CREATE");
    const [dataModalUser, setDataModalUser] = useState<UserType | null>(null);

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemOffset]);

    const fetchUsers = async () => {
        const response: FetchUserResponse | undefined = await fetchAllUsers(itemOffset, itemLimit);
        if (response && response.EC === 0) {
            setPageCount(Number(response.DT.totalPage));
            setListUser(response.DT.users);
        } else {
            console.error("Failed to fetch users");
        }
    };

    const handlePageClick = async (event: { selected: number }) => {
        setItemOffset(event.selected + 1);
        await fetchUsers();
    };

    const handleDeleteUser = (user: UserType) => {
        setUserToDelete(user);
        setShowModalDelete(true);
    };

    const handleClose = () => {
        setShowModalDelete(false);
        setUserToDelete(null);
    };

    const ConfirmDelete = async () => {
        if (!userToDelete) return;
        const response = await deleteUser(userToDelete);
        if (response && +response.EC === 0) {
            toast.success(response.EM);
            await fetchUsers();
            setShowModalDelete(false);
        } else {
            toast.error(response?.EM);
        }
    };

    const onHideModalUser = async () => {
        setShowModalUser(false);
        setDataModalUser(null);
        await fetchUsers();
    };

    const handleEditUser = (user: UserType) => {
        setActionModalUser("UPDATE");
        setShowModalUser(true);
        setDataModalUser(user);
    };

    const handleRefresh = async () => {
        await fetchUsers();
    };

    return (
        <>
            <div className="max-w-7xl mx-auto mt-11 px-4">
                <div className="bg-white shadow rounded-lg p-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-center border-b pb-4">
                        <div className="title mt-3 sm:mt-0">
                            <h3 className="text-xl font-semibold text-gray-800">Manager User</h3>
                        </div>
                        <div className="flex gap-3 mt-3 sm:mt-0">
                            <button
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                onClick={handleRefresh}
                            >
                                <i className="fa fa-refresh pr-2"></i> Refresh
                            </button>
                            <button
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                onClick={() => {
                                    setShowModalUser(true);
                                    setActionModalUser("CREATE");
                                }}
                            >
                                <i className="fa fa-plus pr-2"></i> Add User
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto mt-4">
                        <table className="w-full text-left border border-gray-200 rounded-lg">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 border">No</th>
                                    <th className="px-4 py-2 border">Email</th>
                                    <th className="px-4 py-2 border">User name</th>
                                    <th className="px-4 py-2 border">Group</th>
                                    <th className="px-4 py-2 border">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listUser.length > 0 ? (
                                    listUser.map((item, index) => (
                                        <tr
                                            key={`user-${index}`}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="px-4 py-2 border">
                                                {(itemOffset - 1) * itemLimit + index + 1}
                                            </td>
                                            <td className="px-4 py-2 border">{item.email}</td>
                                            <td className="px-4 py-2 border">{item.username}</td>
                                            <td className="px-4 py-2 border">
                                                {item.Group?.name ?? "N/A"}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <div className="flex items-center space-x-3">
                                                    <FaPencilAlt
                                                        className="text-orange-500 cursor-pointer hover:text-orange-600"
                                                        onClick={() => handleEditUser(item)}
                                                    />
                                                    <FaTrash
                                                        className="text-red-500 cursor-pointer hover:text-red-600"
                                                        onClick={() => handleDeleteUser(item)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4">
                                            <span className="text-gray-500">Not found user</span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>


                </div>
                <div className="mt-4 flex justify-center">
                    <ReactPaginate
                        nextLabel="next >"
                        previousLabel="< previous"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={2}
                        pageCount={pageCount}
                        containerClassName="flex space-x-2"

                        pageClassName="inline-block"
                        pageLinkClassName="px-3 py-1 border rounded-md cursor-pointer hover:bg-gray-100"

                        previousClassName="inline-block"
                        previousLinkClassName="px-3 py-1 border rounded-md cursor-pointer hover:bg-gray-100"

                        nextClassName="inline-block"
                        nextLinkClassName="px-3 py-1 border rounded-md cursor-pointer hover:bg-gray-100"

                        breakClassName="inline-block"
                        breakLinkClassName="px-3 py-1 border rounded-md"

                        activeLinkClassName="bg-blue-500 text-white border-blue-500"
                        disabledLinkClassName="opacity-50 cursor-not-allowed"
                    />
                </div>
            </div >

            {userToDelete && (
                <ModalDelete
                    show={showModalDelete}
                    handleClose={handleClose}
                    ConfirmDelete={ConfirmDelete}
                    userToDelete={userToDelete} // lúc này chắc chắn không null
                />
            )
            }
            <ModalUser
                Title={'Create new user'}
                hide={onHideModalUser}
                show={isShowModalUser}
                action={actionModalUser}
                dataModalUser={dataModalUser}
            />
        </>
    );
};

export default User;
