import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { fetchAllRole, deleteRole } from '../../Services/roleService'
import { toast } from 'react-toastify';
import Roles from './Roles';
import ReactPaginate from 'react-paginate';
import ModalDelete from './ModalDeleteRole';
import ModalEditRole from './ModalEditRole';
import './Roles.scss'

const TableRoles = forwardRef((props, ref) => {
    const [listRoles, setListRoles] = useState([]);
    const [itemOffset, setItemOffset] = useState(1);
    const [itemLimit, setItemLimit] = useState(5);
    const [pageCount, setPageCount] = useState(0);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState({});
    const [isShowModalRole, setShowModalRole] = useState(false)
    const [dataModalRole, setDataModalRole] = useState("")


    useEffect(() => {
        fetchAllRoles();
    }, [itemOffset]);


    const fetchAllRoles = async () => {
        let response = await fetchAllRole();
        if (response && response.EC === 0) {
            const totalPage = response.DT.length;
            const offset = (itemOffset - 1) * itemLimit;
            const endIdx = offset + itemLimit;
            const paginatedRoles = response.DT.slice(offset, endIdx);
            setListRoles(paginatedRoles);
            setPageCount(Math.ceil(totalPage / itemLimit));
        } else {
            console.error("Failed to fetch roles");
        }
    }
    const onHideModalUser = async () => {
        setShowModalRole(false)
        setDataModalRole({})
        await fetchAllRoles()
    }

    const handlePageClick = async (event) => {
        setItemOffset(+event.selected + 1);
    };

    useImperativeHandle(ref, () => ({

        fecthListRole() {
            fetchAllRoles()
        }

    }));
    const handleDeleteRole = async (role) => {
        setRoleToDelete(role);
        setShowModalDelete(true);
    }
    const handleClose = () => {
        setShowModalDelete(false);
        setRoleToDelete({});
    }

    const ConfirmDelete = async () => {
        let response = await deleteRole(roleToDelete);
        if (response && +response.EC === 0) {
            toast.success(response.EM);
            await fetchAllRoles();
            setShowModalDelete(false);
        } else {
            toast.error(response.EM);
        }
    }
    const handleEditRole = (role) => {
        setShowModalRole(true)
        setDataModalRole(role)
    }


    return (
        <>
            <div className='user-table'>
                <div className=' mt-3 table-role'>
                    <table className="table table-hover table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">URL</th>
                                <th scope="col">Description</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listRoles && listRoles.length > 0 ?
                                <>
                                    {listRoles.map((item, index) => {
                                        return (
                                            <tr key={`url-${index}`}>
                                                <th>{(itemOffset - 1) * itemLimit + index + 1}</th>
                                                <td>{item.url}</td>
                                                <td>{item.description}</td>
                                                <td>
                                                    <span className='edit'
                                                        onClick={() => handleEditRole(item)}
                                                    >
                                                        <i className="fa fa-pencil" aria-hidden="true"></i>
                                                    </span>
                                                    <span className='delete'
                                                        onClick={() => handleDeleteRole(item)}
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
                                    <tr><td colSpan={5}>not found roles</td></tr>
                                </>
                            }
                        </tbody>

                    </table>
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
                roleToDelete={roleToDelete}
            />
            <ModalEditRole
                Title={'Edit role'}
                hide={onHideModalUser}
                show={isShowModalRole}
                dataModalRole={dataModalRole}
            />
        </>
    );
})

export default TableRoles;