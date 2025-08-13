import React, { useState, useEffect } from 'react';
import { fetchAllUsers, deleteUser } from '../../../Services/userService';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import ModalDelete from './ModalDelete';
import ModalUser from './ModalUser';

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
            <div className="container">
                <div className="manage-user-container">
                    <div className="user-header">
                        <div className="title mt-3">
                            <h3>Manager User</h3>
                        </div>
                        <div className="user-actions my-3">
                            <button
                                className="btn btn-success refresh mr-[10px]"
                                onClick={handleRefresh}
                            >
                                <i className="fa fa-refresh pr-[7px]"></i> refresh
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    setShowModalUser(true);
                                    setActionModalUser("CREATE");
                                }}
                            >
                                <i className="fa fa-plus pr-[7px]"></i> Add User
                            </button>
                        </div>
                    </div>

                    <div className="user-table">
                        <div className="table">
                            <table className="table table-hover table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">No</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">User name</th>
                                        <th scope="col">Group</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listUser.length > 0 ? (
                                        listUser.map((item, index) => (
                                            <tr key={`user-${index}`}>
                                                <th>{(itemOffset - 1) * itemLimit + index + 1}</th>
                                                <td>{item.email}</td>
                                                <td>{item.username}</td>
                                                <td>{item.Group?.name ?? 'N/A'}</td>
                                                <td>
                                                    <span
                                                        className="edit text-orange-500 cursor-pointer pr-[10px]"
                                                        onClick={() => handleEditUser(item)}
                                                    >
                                                        <i className="fa fa-pencil"></i>
                                                    </span>
                                                    <span
                                                        className="delete text-red-500 cursor-pointer"
                                                        onClick={() => handleDeleteUser(item)}
                                                    >
                                                        <i className="fa fa-trash"></i>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5}><span>Not found user</span></td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {pageCount > 0 && (
                        <div className="footer">
                            <ReactPaginate
                                nextLabel="next >"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={2}
                                pageCount={pageCount}
                                previousLabel="< previous"
                                pageClassName="page-item"
                                pageLinkClassName="page-link"
                                previousClassName="page-item"
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                breakLabel="..."
                                breakClassName="page-item"
                                breakLinkClassName="page-link"
                                containerClassName="pagination"
                                activeClassName="active"
                                renderOnZeroPageCount={null}
                            />
                        </div>
                    )}
                </div>
            </div>

            {userToDelete && (
                <ModalDelete
                    show={showModalDelete}
                    handleClose={handleClose}
                    ConfirmDelete={ConfirmDelete}
                    userToDelete={userToDelete} // lúc này chắc chắn không null
                />
            )}
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
