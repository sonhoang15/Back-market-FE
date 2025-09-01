import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  Ref,
} from 'react';
import { fetchAllRole, deleteRole } from '../../../Services/roleService';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import ModalDelete from './ModalDeleteRole';
import ModalEditRole from './ModalEditRole';

interface Role {
  id: number;
  url: string;
  description: string;
  name?: string;
}

interface TableRolesRef {
  fecthListRole: () => void;
}

const TableRoles = forwardRef<TableRolesRef>((props, ref: Ref<TableRolesRef>) => {
  const [listRoles, setListRoles] = useState<Role[]>([]);
  const [itemOffset, setItemOffset] = useState<number>(1);
  const [itemLimit] = useState<number>(5);
  const [pageCount, setPageCount] = useState<number>(0);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [isShowModalRole, setShowModalRole] = useState<boolean>(false);
  const [dataModalRole, setDataModalRole] = useState<Role | null>(null);

  useEffect(() => {
    fetchAllRoles();
  }, [itemOffset]);

  const fetchAllRoles = async () => {
    try {
      const response = await fetchAllRole();
      if (response && response.EC === 0) {
        const totalPage = response.DT.length;
        const offset = (itemOffset - 1) * itemLimit;
        const endIdx = offset + itemLimit;
        const paginatedRoles = response.DT.slice(offset, endIdx);
        setListRoles(paginatedRoles);
        setPageCount(Math.ceil(totalPage / itemLimit));
      } else {
        console.error('Failed to fetch roles');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const onHideModalUser = async () => {
    setShowModalRole(false);
    setDataModalRole(null);
    await fetchAllRoles();
  };

  const handlePageClick = (event: { selected: number }) => {
    setItemOffset(event.selected + 1);
  };

  useImperativeHandle(ref, () => ({
    fecthListRole() {
      fetchAllRoles();
    },
  }));

  const handleDeleteRole = (role: Role) => {
    setRoleToDelete(role);
    setShowModalDelete(true);
  };

  const handleClose = () => {
    setShowModalDelete(false);
    setRoleToDelete(null);
  };

  const ConfirmDelete = async () => {
    if (!roleToDelete) return;
    const response = await deleteRole({ id: roleToDelete.id });
    if (response && +response.EC === 0) {
      toast.success(response.EM);
      await fetchAllRoles();
      setShowModalDelete(false);
    } else {
      toast.error(response.EM);
    }
  };

  const handleEditRole = (role: Role) => {
    setShowModalRole(true);
    setDataModalRole(role);
  };

  return (
    <>
      <div className="user-table">
        <div className="mt-3 table-role">
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
              {listRoles.length > 0 ? (
                listRoles.map((item, index) => (
                  <tr key={`url-${index}`}>
                    <th>{(itemOffset - 1) * itemLimit + index + 1}</th>
                    <td>{item.url}</td>
                    <td>{item.description}</td>
                    <td>
                      <span
                        className="edit"
                        onClick={() => handleEditRole(item)}
                      >
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </span>
                      <span
                        className="delete"
                        onClick={() => handleDeleteRole(item)}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>not found roles</td>
                </tr>
              )}
            </tbody>
          </table>
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

      <ModalDelete
        show={showModalDelete}
        handleClose={handleClose}
        ConfirmDelete={ConfirmDelete}
        roleToDelete={roleToDelete!}
      />

      <ModalEditRole
        Title={'Edit role'}
        hide={onHideModalUser}
        show={isShowModalRole}
        dataModalRole={dataModalRole}
        action={'UPDATE'}
      />
    </>
  );
});

export default TableRoles;
