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
import { FaPencilAlt, FaTrash } from "react-icons/fa";

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
      <div className="mt-3">
        <div className="overflow-auto border rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">URL</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {listRoles.length > 0 ? (
                listRoles.map((item, index) => (
                  <tr
                    key={`url-${index}`}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="border px-4 py-2">
                      {(itemOffset - 1) * itemLimit + index + 1}
                    </td>
                    <td className="border px-4 py-2">{item.url}</td>
                    <td className="border px-4 py-2">{item.description}</td>
                    <td className="border px-4 py-2 text-center">
                      <div className="flex justify-center space-x-3">
                        <span
                          className="text-yellow-500 cursor-pointer hover:text-yellow-600"
                          onClick={() => handleEditRole(item)}
                        >
                          <FaPencilAlt />
                        </span>
                        <span
                          className="text-red-500 cursor-pointer hover:text-red-600"
                          onClick={() => handleDeleteRole(item)}
                        >
                          <FaTrash />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-2 text-center" colSpan={4}>
                    not found roles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
