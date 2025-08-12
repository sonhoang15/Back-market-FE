import React, { useState, useEffect } from 'react';
import { fetchAllUsers, deleteUser } from '../../Services/userService';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import ModalDelete from './ModalDelete';
import ModalUser from './ModalUser';
import "./User.scss";



const User = (props) => {
    const [listUser, setListUser] = useState([]);
    const [itemOffset, setItemOffset] = useState(1);
    const [itemLimit, setItemLimit] = useState(5);
    const [pageCount, setPageCount] = useState(0);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [userToDelete, setUserToDelete] = useState({});
    const [isShowModalUser, setShowModalUser] = useState(false)
    const [actionModalUser, setActionModalUser] = useState("CREATE")
    const [dataModalUser, setDataModalUser] = useState("")

    useEffect(() => {
        fetchUsers();
    }, [itemOffset]);

    const fetchUsers = async () => {
        let response = await fetchAllUsers(itemOffset, itemLimit);
        if (response && response.EC === 0) {
            setPageCount(+response.DT.totalPage);
            setListUser(response.DT.users);
        } else {
            console.error("Failed to fetch users");
        }
    }
    const handlePageClick = async (event) => {
        setItemOffset(+event.selected + 1);
        await fetchUsers()
    };
    const handleDeleteUser = async (user) => {
        setUserToDelete(user);
        setShowModalDelete(true);
    }
    const handleClose = () => {
        setShowModalDelete(false);
        setUserToDelete({});
    }

    const ConfirmDelete = async () => {
        let response = await deleteUser(userToDelete);
        if (response && +response.EC === 0) {
            toast.success(response.EM);
            await fetchUsers();
            setShowModalDelete(false);
        } else {
            toast.error(response.EM);
        }
    }
    const onHideModalUser = async () => {
        setShowModalUser(false)
        setDataModalUser({})
        await fetchUsers()
    }
    const handleEditUser = (user) => {
        setActionModalUser("UPDATE")
        setShowModalUser(true)
        setDataModalUser(user)
    }
    const handleRefresh = async () => {
        await fetchUsers()
    }
    return (
        <>
            <div className=' container'>
                <div className='manage-user-container'>
                    <div className='user-header'>
                        <div className='title mt-3'>
                            <h3>Manager User</h3>
                        </div>
                        <div className='user-actions my-3'>
                            <button
                                className='btn btn-success refresh'
                                onClick={() => handleRefresh}
                            >
                                <i className="fa fa-refresh" ></i>refresh
                            </button>
                            <button className='btn btn-primary'
                                onClick={() => {
                                    setShowModalUser(true);
                                    setActionModalUser("CREATE")
                                }
                                }> <i className="fa fa-plus" ></i>Add User
                            </button>
                        </div>
                    </div>
                    <div className='user-table'>
                        <div className='table'>
                            <table className="table table-hover table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">No</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">User name</th>
                                        <th scope="col">Group</th>
                                        <th scope="col">action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listUser && listUser.length > 0 ?
                                        <>
                                            {listUser.map((item, index) => {
                                                return (
                                                    <tr key={`user-${index}`}>
                                                        <th>{(itemOffset - 1) * itemLimit + index + 1}</th>
                                                        <td>{item.email}</td>
                                                        <td>{item.username}</td>
                                                        <td>{item.Group ? item.Group.name : 'N/A'}</td>
                                                        <td>
                                                            <span className='edit'
                                                                onClick={() => handleEditUser(item)}
                                                            >
                                                                <i className="fa fa-pencil" aria-hidden="true"></i>
                                                            </span>
                                                            <span className='delete'
                                                                onClick={() => handleDeleteUser(item)}
                                                            ><i className="fa fa-trash" aria-hidden="true"></i>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                            )}
                                        </>
                                        :
                                        <>
                                            <tr><td><span>not found user</span></td></tr>
                                        </>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {pageCount > 0 &&
                        <div className='footer'>
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
                    }
                </div>
            </div>
            <ModalDelete
                show={showModalDelete}
                handleClose={handleClose}
                ConfirmDelete={ConfirmDelete}
                userToDelete={userToDelete}
            />
            <ModalUser
                Title={'Create new user'}
                hide={onHideModalUser}
                show={isShowModalUser}
                action={actionModalUser}
                dataModalUser={dataModalUser}
            />
        </>
    );
}

export default User;